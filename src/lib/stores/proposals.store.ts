import type { GovernanceCanisterId } from '$lib/types/core';
import type { Proposal } from '$lib/types/governance';
import type { Store } from '$lib/types/store';
import { nonNullish } from '@dfinity/utils';
import { writable } from 'svelte/store';

export type ProposalsData = Record<GovernanceCanisterId, Proposal[]> | undefined | null;

export type ProposalsSetData = {
	governanceCanisterId: GovernanceCanisterId;
	proposals: Proposal[];
};

export type ProposalsStore = Store<ProposalsData, ProposalsSetData>;

const initProposalsStore = (): ProposalsStore => {
	const INITIAL: ProposalsData = undefined;

	const { subscribe, set, update } = writable<ProposalsData>(INITIAL);

	return {
		set: ({ governanceCanisterId, proposals }: ProposalsSetData) =>
			update((state) => ({
				...(nonNullish(state) && state),
				[governanceCanisterId]: proposals
			})),
		reset: () => set(null),
		subscribe
	};
};

export const proposalsStore = initProposalsStore();
