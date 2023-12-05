import type { GovernanceCanisterId } from '$lib/types/core';
import type { ProposalMetadataDoc } from '$lib/types/juno';
import type { Store } from '$lib/types/store';
import { nonNullish } from '@dfinity/utils';
import type { ListResults } from '@junobuild/core-peer';
import { writable } from 'svelte/store';

export type UserProposalsData =
	| Record<GovernanceCanisterId, ListResults<ProposalMetadataDoc>>
	| undefined
	| null;

export type UserProposalsSetData = {
	governanceCanisterId: GovernanceCanisterId;
	proposals: ListResults<ProposalMetadataDoc>;
};

export type UserProposalsStore = Store<UserProposalsData, UserProposalsSetData>;

const initUserProposalsStore = (): UserProposalsStore => {
	const INITIAL: UserProposalsData = undefined;

	const { subscribe, set, update } = writable<UserProposalsData>(INITIAL);

	return {
		set: ({ governanceCanisterId, proposals }: UserProposalsSetData) =>
			update((state) => ({
				...(nonNullish(state) && state),
				[governanceCanisterId]: proposals
			})),
		reset: () => set(null),
		subscribe
	};
};

export const userProposalsStore = initUserProposalsStore();
