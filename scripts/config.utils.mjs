import { readFile } from 'node:fs/promises';

export const readConfig = async () => {
	const buffer = await readFile('./juno.dev.config.json');
	return JSON.parse(buffer.toString('utf-8'));
};
