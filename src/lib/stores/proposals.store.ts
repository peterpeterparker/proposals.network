import type { ProposalToken } from '$lib/types/juno';
import type { Store } from '$lib/types/store';
import type { ProposalInfo } from '@dfinity/nns';
import { nonNullish } from '@dfinity/utils';
import { writable } from 'svelte/store';

export type ProposalsData = Record<ProposalToken, ProposalInfo[]> | undefined | null;

export type ProposalsSetData = {
	token: ProposalToken;
	proposals: ProposalInfo[];
};

export type ProposalsStore = Store<ProposalsData, ProposalsSetData>;

const initProposalsStore = (): ProposalsStore => {
	const INITIAL: ProposalsData = undefined;

	const { subscribe, set, update } = writable<ProposalsData>(INITIAL);

	return {
		set: ({ token, proposals }: ProposalsSetData) =>
			update((state) => ({
				...(nonNullish(state) && state),
				[token]: proposals
			})),
		reset: () => set(null),
		subscribe
	};
};

export const proposalsStore = initProposalsStore();
