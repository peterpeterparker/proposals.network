import { busy } from '$lib/stores/busy.store';
import { toasts } from '$lib/stores/toasts.store';
import { snsYaml } from '$lib/types/sns';
import type { UserOption } from '$lib/types/user';
import { fromNullable, isNullish, nonNullish } from '@dfinity/utils';
import { downloadUrl, getAsset, uploadFile } from '@junobuild/core-peer';
import { nanoid } from 'nanoid';
import { parse } from 'yaml';
import type {ProposalKey} from "$lib/types/juno";

export const getSnsYaml = async (
	key: ProposalKey | undefined | null
): Promise<{ result: 'ok' | 'error'; downloadUrl?: string | undefined }> => {
	if (isNullish(key)) {
		toasts.error({
			msg: {
				text: 'No route key is provided, therefore the Yaml file cannot be fetched.'
			}
		});
		return { result: 'error' };
	}

	try {
		const asset = await getAsset({
			collection: 'sns-yaml',
			fullPath: `/sns-yaml/${key}.yaml`
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
			msg: { text: 'Something went wrong while getting your neuron metadata.' },
			err
		});
		return { result: 'error' };
	}
};

export const uploadSnsYaml = async ({
	user,
	key,
	file
}: {
	user: UserOption;
	file: File;
	key: ProposalKey | undefined | null;
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
				text: 'No key is provided, therefore the Yaml file cannot be saved.'
			}
		});
		return { result: 'error' };
	}

	const { result } = await assertSnsYaml(file);

	if (result === 'error') {
		return { result };
	}

	busy.start();

	try {
		const { downloadUrl } = await uploadFile({
			collection: 'sns-yaml',
			data: file,
			fullPath: `/sns-yaml/${key}.yaml`,
			token: nanoid()
		});

		toasts.show({
			text: 'Your Yaml file is valid and saved. Well done. 👍',
			level: 'info',
			duration: 2000
		});

		return { result: 'ok', downloadUrl };
	} catch (err: unknown) {
		toasts.error({
			msg: { text: 'Something went wrong while saving the Yaml file.' },
			err
		});
		return { result: 'error' };
	} finally {
		busy.stop();
	}
};

const assertSnsYaml = async (file: File): Promise<{ result: 'ok' | 'error' }> => {
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
