import pkgAgent from '@dfinity/agent';
import { idlFactory } from '../node_modules/@junobuild/admin/dist/declarations/satellite/satellite.factory.did.mjs';
import { getDfxIdentity } from './dfx.identity.mjs';
import { initIdentity } from './identity.utils.mjs';
import { satellite } from './satellite.utils.mjs';

const { HttpAgent, Actor } = pkgAgent;

export const getActor = async () => {
	const { satelliteId, container: host } = satellite;

	const agent = await getAgent();

	return Actor.createActor(idlFactory, {
		agent,
		canisterId: satelliteId
	});
};

export const getSnsWasmActor = async (canisterId) => {
	const { idlFactory } = await import('../node_modules/@dfinity/nns/dist/candid/sns_wasm.idl.mjs');

	const agent = await getAgent();

	return Actor.createActor(idlFactory, {
		agent,
		canisterId
	});
};

export const getGovernanceActor = async (canisterId) => {
	const { idlFactory } = await import(
		'../node_modules/@dfinity/nns/dist/candid/governance.idl.mjs'
	);

	const agent = await getDfxAgent();

	return Actor.createActor(idlFactory, {
		agent,
		canisterId
	});
};

export const getGovernanceTestActor = async (canisterId) => {
	const { idlFactory } = await import(
		'../node_modules/@dfinity/nns/dist/candid/governance_test.idl.mjs'
	);

	const agent = await getDfxAgent();

	return Actor.createActor(idlFactory, {
		agent,
		canisterId
	});
};

const getAgent = async () => {
	const identity = initIdentity();

	const agent = new HttpAgent({ identity, fetch, host: 'http://localhost:8080' });
	await agent.fetchRootKey();

	return agent;
};

const getDfxAgent = async () => {
	const identity = getDfxIdentity();

	console.log('Identity:', identity.getPrincipal().toText());

	const agent = new HttpAgent({ identity, fetch, host: 'http://localhost:8080' });
	await agent.fetchRootKey();

	return agent;
};
