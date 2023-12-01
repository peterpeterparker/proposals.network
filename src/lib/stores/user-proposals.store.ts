import type {ProposalMetadata, ProposalMetadataDoc, ProposalToken} from '$lib/types/juno';
import type { Store } from '$lib/types/store';
import { nonNullish } from '@dfinity/utils';
import { writable } from 'svelte/store';
import type {ListResults} from "@junobuild/core";

export type UserProposalsData = Record<ProposalToken, ListResults<ProposalMetadataDoc>> | undefined | null;

export type UserProposalsSetData = { token: ProposalToken; proposals: ListResults<ProposalMetadataDoc> };

export type UserProposalsStore = Store<
	UserProposalsData,
	UserProposalsSetData
>;

const initUserProposalsStore = (): UserProposalsStore => {
	const INITIAL: UserProposalsData = undefined;

	const { subscribe, set, update } = writable<UserProposalsData>(INITIAL);

	return {
		set: ({ token, proposals }: UserProposalsSetData) =>
			update((state) => ({
				...(nonNullish(state) && state),
				[token]: proposals
			})),
		reset: () => set(null),
		subscribe
	};
};

export const userProposalsStore = initUserProposalsStore();
