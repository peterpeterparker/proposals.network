import { toasts } from '$lib/stores/toasts.store';
import { snsYaml } from '$lib/types/sns';
import { parse } from 'yaml';

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

	toasts.show({
		text: "Your Yaml file is valid. Well done. 👍",
		level: 'info',
		duration: 2000
	});

	return { result: 'ok' };
};
