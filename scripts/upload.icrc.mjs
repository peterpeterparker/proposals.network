#!/usr/bin/env node

import { hexStringToUint8Array } from '@dfinity/utils';
import { createHash } from 'crypto';
import { copyFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getSnsWasmActor } from './actor.utils.mjs';

const snsWasmCanisterId = 'qaa6y-5yaaa-aaaaa-aaafa-cai';

copyFileSync(
	join(process.cwd(), 'node_modules/@dfinity/nns/dist/candid/sns_wasm.idl.js'),
	join(process.cwd(), 'node_modules/@dfinity/nns/dist/candid/sns_wasm.idl.mjs')
);

const loadGWasm = async () => {
	const buffer = await readFile(`${process.cwd()}/ic-icrc1-index-ng.wasm.gz`);

	return {
		wasm: [...new Uint8Array(buffer)],
		hash: createHash('sha256').update(buffer).digest('hex')
	};
};

const deployIndexCanister = async () => {
	// The canister of that SNS-Wasm on mainnet is qaa6y-5yaaa-aaaaa-aaafa-cai
	const actor = await getSnsWasmActor(snsWasmCanisterId);

	/**
	 * enum SnsCanisterType {
	 *   SNS_CANISTER_TYPE_UNSPECIFIED = 0;
	 *   // The type for the root canister.
	 *   SNS_CANISTER_TYPE_ROOT = 1;
	 *   // The type for the governance canister.
	 *   SNS_CANISTER_TYPE_GOVERNANCE = 2;
	 *   // The type for the ledger canister.
	 *   SNS_CANISTER_TYPE_LEDGER = 3;
	 *   // The type for the swap canister.
	 *   SNS_CANISTER_TYPE_SWAP = 4;
	 *   // The type for the ledger archive canister.
	 *   SNS_CANISTER_TYPE_ARCHIVE = 5;
	 *   // The type for the index canister.
	 *   SNS_CANISTER_TYPE_INDEX = 6;
	 * }
	 */

	const { wasm, hash } = await loadGWasm();

	console.log(`Upload ${hash}`);

	await actor.add_wasm({
		hash: hexStringToUint8Array(hash),
		wasm: [
			{
				wasm,
				proposal_id: [],
				canister_type: 6
			}
		]
	});

	// dfx canister call qaa6y-5yaaa-aaaaa-aaafa-cai get_latest_sns_version_pretty
	console.log(await actor.get_latest_sns_version_pretty(null));
};

await deployIndexCanister();
