import type { Proposal } from '$lib/types/datastore';
import { clear, createStore, entries, set } from 'idb-keyval';

const proposalsStore = createStore('pnwrk-proposals', 'proposals');

export const setProposal = ({
	key,
	proposal
}: {
	key: string;
	proposal: Proposal;
}): Promise<void> => set(key, proposal, proposalsStore);

export const getProposals = (): Promise<[string, Proposal][]> => entries(proposalsStore);

export const clearProposals = (): Promise<void> => clear(proposalsStore);
