import type { Writable } from 'svelte/store';

export interface ProposalStore<T> {
	proposal: T | undefined;
}

export type ProposalStoreData<T> = ProposalStore<T> | undefined | null;

export interface ProposalContext<T> {
	store: Writable<ProposalStoreData<T>>;
	reset: () => void;
}

export const PROPOSAL_CONTEXT_KEY = Symbol('proposal');
