import { DEV, HOST } from '$lib/constants/app.constants';
import { createAgent, isNullish } from '@dfinity/utils';
import type { HttpAgent, Identity } from '@icp-sdk/core/agent';

let agents: Record<string, HttpAgent> | undefined | null = undefined;

export const getAgent = async ({ identity }: { identity: Identity }): Promise<HttpAgent> => {
	const key = identity.getPrincipal().toText();

	if (isNullish(agents) || isNullish(agents[key])) {
		const agent = await createAgent({
			host: HOST,
			identity,
			fetchRootKey: DEV
		});

		agents = {
			...(agents ?? {}),
			[key]: agent
		};

		return agent;
	}

	return agents[key];
};

export const clearAgents = async (): Promise<void> => {
	agents = null;
};
