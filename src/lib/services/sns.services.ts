import { busy } from '$lib/stores/busy.store';
import { toasts } from '$lib/stores/toasts.store';
import type { ProposalKey, StorageSnsCollections } from '$lib/types/juno';
import { snsYaml } from '$lib/types/sns';
import type { UserOption } from '$lib/types/user';
import { fromNullable, isNullish, nonNullish } from '@dfinity/utils';
import { downloadUrl, getAsset, uploadFile } from '@junobuild/core-peer';
import { nanoid } from 'nanoid';
import { parse } from 'yaml';

export const getDownloadUrl = async ({
	key,
	collection,
	extension
}: {
	key: ProposalKey;
	collection: StorageSnsCollections;
	extension: 'yaml' | 'png';
}): Promise<{ result: 'ok' | 'error'; downloadUrl?: string | undefined }> => {
	const fullPath = `/${collection}/${key}.${extension}`;

	try {
		const asset = await getAsset({
			collection,
			fullPath
		});

		return {
			result: 'ok',
			...(nonNullish(asset) && {
				downloadUrl: downloadUrl({
					assetKey: {
						fullPath: asset.key.full_path,
						token: fromNullable(asset.key.token)
					}
				})
			})
		};
	} catch (err: unknown) {
		toasts.error({
			msg: { text: `Something went wrong while getting the file ${fullPath}.` },
			err
		});
		return { result: 'error' };
	}
};

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

	const fullPath = `/${collection}/${key}.${extension}`;

	try {
		const { downloadUrl } = await uploadFile({
			collection,
			data: file,
			fullPath,
			token: nanoid()
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

export const assertSnsYaml = async (file: File): Promise<{ result: 'ok' | 'error' }> => {
	const reader = new FileReader();
	await new Promise((resolve, reject) => {
		reader.onload = resolve;
		reader.onerror = reject;
		reader.readAsText(file);
	});

	const dataURL = reader?.result as string;

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
		snsYaml.parse(json);
	} catch (err: unknown) {
		toasts.error({
			msg: {
				text: 'The Yaml file contains invalid data. Verify that all required fields are provided with the expected format.'
			},
			err
		});
		return { result: 'error' };
	}

	return { result: 'ok' };
};
