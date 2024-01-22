import pkgAgent from '@dfinity/agent';
import { idlFactory } from '../node_modules/@junobuild/admin/declarations/satellite/satellite.factory.did.mjs';
import { satellite } from './satellite.utils.mjs';

const { HttpAgent, Actor } = pkgAgent;

export const getActor = async () => {
	const { identity, satelliteId, container: host } = satellite;

	const agent = new HttpAgent({ identity, fetch, host });
	await agent.fetchRootKey();

	return Actor.createActor(idlFactory, {
		agent,
		canisterId: satelliteId
	});
};
