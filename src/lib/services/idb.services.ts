import type { Proposal } from '$lib/types/datastore';
import { clear, createStore, entries, get, setMany } from 'idb-keyval';

const KEY_PROPOSAL = 'proposal';
const KEY_LAST_CHANGE = 'last-change';

const proposalsStore = createStore('pnwrk-proposals', 'proposals');

export const setProposal = ({
	key,
	proposal
}: {
	key: string;
	proposal: Proposal;
}): Promise<void> =>
	setMany(
		[
			[KEY_LAST_CHANGE, Date.now()],
			[key, proposal]
		],
		proposalsStore
	);

export const getProposals = (): Promise<[string, Proposal][]> => entries(proposalsStore);

export const getLastChange = (): Promise<number | undefined> =>
	get(KEY_LAST_CHANGE, proposalsStore);

export const clearProposals = (): Promise<void> => clear(proposalsStore);
