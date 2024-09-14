#!/usr/bin/env node

import { upgradeSatellite } from '@junobuild/admin';
import { fileExists } from '@junobuild/cli-tools';
import { createHash } from 'crypto';
import { readFile } from 'fs/promises';
import { join } from 'node:path';
import { getDfxIdentity } from './dfx.identity.mjs';

const satelliteId = 'jx5yt-yyaaa-aaaal-abzbq-cai';

const target = join('target', 'deploy', 'satellite.wasm.gz');
const source = join(process.cwd(), target);

const loadGzippedWasm = async (destination) => {
	const buffer = await readFile(destination);

	return {
		wasm: [...new Uint8Array(buffer)],
		hash: createHash('sha256').update(buffer).digest('hex')
	};
};

const identity = await getDfxIdentity();

export const upgrade = async () => {
	console.log(`About to upgrade Satellite ${satelliteId} with source ${target}...`);

	if (!(await fileExists(source))) {
		throw new Error(`${source} not found.`);
	}

	const { wasm, hash } = await loadGzippedWasm(source);

	await upgradeSatellite({
		satellite: {
			satelliteId,
			identity,
			container: 'http://localhost:8080'
		},
		wasm_module: wasm,
		// TODO: option to be removed
		deprecated: false,
		deprecatedNoScope: false
	});

	console.log(`Module upgraded to hash ${hash}.`);
};

try {
	await upgrade();
} catch (err) {
	console.error(err);
}
