import { HOST, LOCAL } from '$lib/constants/app.constants';
import type { HttpAgent, Identity } from '@dfinity/agent';
import { createAgent, isNullish } from '@dfinity/utils';

let agents: Record<string, HttpAgent> | undefined | null = undefined;

export const getAgent = async ({ identity }: { identity: Identity }): Promise<HttpAgent> => {
	const key = identity.getPrincipal().toText();

	if (isNullish(agents) || isNullish(agents[key])) {
		const agent = await createAgent({
			host: HOST,
			identity,
			fetchRootKey: LOCAL
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
