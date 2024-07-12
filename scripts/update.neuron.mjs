#!/usr/bin/env node

import { assertNonNullish } from '@dfinity/utils';
import { copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { getGovernanceActor, getGovernanceTestActor } from './actor.utils.mjs';

const governanceCanisterId = 'rrkah-fqaaa-aaaaa-aaaaq-cai';

copyFileSync(
	join(process.cwd(), 'node_modules/@dfinity/nns/dist/candid/governance.idl.js'),
	join(process.cwd(), 'node_modules/@dfinity/nns/dist/candid/governance.idl.mjs')
);

copyFileSync(
	join(process.cwd(), 'node_modules/@dfinity/nns/dist/candid/governance_test.idl.js'),
	join(process.cwd(), 'node_modules/@dfinity/nns/dist/candid/governance_test.idl.mjs')
);

const updateNeuron = async () => {
	const [, , neuronId] = process.argv;

	assertNonNullish(neuronId);

	const { get_full_neuron } = await getGovernanceActor(governanceCanisterId);

	const neuron = await get_full_neuron(BigInt(neuronId));

	console.log('Current neuron', neuron.Ok);

	const updateNeuron = {
		...neuron.Ok,
		maturity_e8s_equivalent: 100_000_000_000_000n,
		joined_community_fund_timestamp_seconds: [BigInt(Math.floor(Date.now() / 1000))]
	};

	const { update_neuron } = await getGovernanceTestActor(governanceCanisterId);
	await update_neuron(updateNeuron);
};

await updateNeuron();
