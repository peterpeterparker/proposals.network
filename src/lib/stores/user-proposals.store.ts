import type { ProposalMetadataDoc } from '$lib/types/juno';
import type { Store } from '$lib/types/store';
import { nonNullish } from '@dfinity/utils';
import type { ListResults } from '@junobuild/core';
import { writable } from 'svelte/store';

export type UserProposalsData = ListResults<ProposalMetadataDoc> | undefined | null;

export type UserProposalsSetData = {
	proposals: ListResults<ProposalMetadataDoc>;
};

export type UserProposalsStore = Store<UserProposalsData, UserProposalsSetData>;

const initUserProposalsStore = (): UserProposalsStore => {
	const INITIAL: UserProposalsData = undefined;

	const { subscribe, set, update } = writable<UserProposalsData>(INITIAL);

	return {
		set: ({ proposals }: UserProposalsSetData) =>
			update((state) => ({
				...(nonNullish(state) && state),
				...proposals
			})),
		reset: () => set(null),
		subscribe
	};
};

export const userProposalsStore = initUserProposalsStore();
