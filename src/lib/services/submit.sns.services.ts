import { DEV } from '$lib/constants/app.constants';
import { getEditableAssets, setAsset } from '$lib/services/idb.services';
import { busy } from '$lib/stores/busy.store';
import { toasts } from '$lib/stores/toasts.store';
import type { ProposalKey, StorageSnsCollections } from '$lib/types/juno';
import { type SnsYaml, snsYaml } from '$lib/types/sns';
import type { UserOption } from '$lib/types/user';
import { isNullish } from '@dfinity/utils';
import { uploadFile } from '@junobuild/core-peer';
import { nanoid } from 'nanoid';
import { parse } from 'yaml';

export const snsAssetFullPath = ({
	key,
	collection,
	extension
}: {
	key: ProposalKey;
	collection: StorageSnsCollections;
	extension: 'yaml' | 'png';
}): string => `/${collection}/${key}.${extension}`;

export const uploadSnsFile = async ({
	user,
	key,
	file,
	collection,
	extension,
	assert
}: {
	user: UserOption;
	file: File;
	key: ProposalKey | undefined | null;
	collection: StorageSnsCollections;
	extension: 'yaml' | 'png';
	assert: (file: File) => Promise<{ result: 'ok' | 'error' }>;
}): Promise<{ result: 'ok' | 'error'; downloadUrl?: string }> => {
	if (isNullish(user)) {
		toasts.error({
			msg: { text: 'You are not signed in.' }
		});
		return { result: 'error' };
	}

	if (isNullish(key)) {
		toasts.error({
			msg: {
				text: 'No key is provided, therefore the file cannot be saved.'
			}
		});
		return { result: 'error' };
	}

	const { result } = await assert(file);

	if (result === 'error') {
		return { result };
	}

	busy.start();

	const fullPath = snsAssetFullPath({
		key,
		extension,
		collection
	});

	try {
		const {
			location: { origin }
		} = window;

		const token = nanoid();

		const { downloadUrl } = await uploadFile({
			collection,
			data: file,
			fullPath,
			token,
			...(DEV && { headers: [['Access-Control-Allow-Origin', origin]] })
		});

		await setAsset({
			file,
			fullPath,
			token
		});

		return { result: 'ok', downloadUrl };
	} catch (err: unknown) {
		toasts.error({
			msg: { text: `Something went wrong while saving the file ${fullPath}.` },
			err
		});
		return { result: 'error' };
	} finally {
		busy.stop();
	}
};

const blobToString = async (file: Blob): Promise<string> => {
	const reader = new FileReader();
	await new Promise((resolve, reject) => {
		reader.onload = resolve;
		reader.onerror = reject;
		reader.readAsText(file);
	});

	return reader?.result as string;
}

export const mapSnsYaml = async (
	file: Blob
): Promise<{ result: 'ok' | 'error'; yaml?: SnsYaml }> => {
	let dataURL: string;

	try {
		dataURL = await blobToString(file);
	} catch (err: unknown) {
		toasts.error({
			msg: { text: 'The Yaml file cannot be parsed to a readable string.' },
			err
		});
		return { result: 'error' };
	}

	let json: unknown;

	try {
		json = parse(dataURL);
	} catch (err: unknown) {
		toasts.error({
			msg: { text: 'The Yaml file is invalid. It cannot be parsed to an object.' },
			err
		});
		return { result: 'error' };
	}

	try {
		const yaml = snsYaml.parse(json);
		return { result: 'ok', yaml };
	} catch (err: unknown) {
		toasts.error({
			msg: {
				text: 'The Yaml file contains invalid data. Verify that all required fields are provided with the expected format.'
			},
			err
		});
		return { result: 'error' };
	}
};

export const assertCreateServiceNervousSystemAssets = async (
	key: ProposalKey | undefined | null
): Promise<{ valid: boolean }> => {
	const assets = await getEditableAssets();

	if (isNullish(assets)) {
		toasts.error({ msg: { text: 'No assets have been uploaded.' } });
		return { valid: false };
	}

	if (isNullish(key)) {
		toasts.error({
			msg: {
				text: 'No key is provided, therefore the files cannot be asserted.'
			}
		});
		return { valid: false };
	}

	const yamlFullPath = snsAssetFullPath({
		key,
		extension: 'yaml',
		collection: 'sns-parameters'
	});

	const yamlAsset = assets?.find(({ fullPath }) => fullPath === yamlFullPath);

	if (isNullish(yamlAsset)) {
		toasts.error({ msg: { text: 'No Yaml file has been uploaded.' } });
		return { valid: false };
	}

	const logoFullPath = snsAssetFullPath({
		key,
		extension: 'png',
		collection: 'sns-logo'
	});

	const logoAsset = assets?.find(({ fullPath }) => fullPath === logoFullPath);

	if (isNullish(logoAsset)) {
		toasts.error({ msg: { text: 'No logo file has been uploaded.' } });
		return { valid: false };
	}

	return { valid: true };
};

export const getSnsData = async (
	key: ProposalKey
): Promise<{ result: 'ok' | 'error'; yaml?: SnsYaml, logo?: string }> => {
	const assets = await getEditableAssets();

	if (isNullish(assets)) {
		toasts.error({ msg: { text: 'No assets have been uploaded.' } });
		return { result: 'error' };
	}

	const yamlFullPath = snsAssetFullPath({
		key,
		extension: 'yaml',
		collection: 'sns-parameters'
	});

	const yamlAsset = assets?.find(({ fullPath }) => fullPath === yamlFullPath);

	if (isNullish(yamlAsset)) {
		toasts.error({ msg: { text: 'No Yaml file has been uploaded.' } });
		return { result: 'error' };
	}

	const { result, yaml } = await mapSnsYaml(yamlAsset.file);

	if (result === 'error' || isNullish(yaml)) {
		return { result: 'error' };
	}

	const logoFullPath = snsAssetFullPath({
		key,
		extension: 'png',
		collection: 'sns-logo'
	});

	const logoAsset = assets?.find(({ fullPath }) => fullPath === logoFullPath);

	if (isNullish(logoAsset)) {
		toasts.error({ msg: { text: 'No logo file has been uploaded.' } });
		return { result: 'error' };
	}

	return {
		result: 'ok',
		yaml,
		logo: await blobToString(logoAsset.file)
	};
};
