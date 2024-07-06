import { snsYaml } from '$lib/types/sns';
import { parse } from 'yaml';

export const assertSnsYaml = async (file: File) => {
	const reader = new FileReader();
	await new Promise((resolve, reject) => {
		reader.onload = resolve;
		reader.onerror = reject;
		reader.readAsText(file);
	});

	const dataURL = reader?.result as string;

	const json = parse(dataURL);

    snsYaml.parse(json);
};
