import type { Writable } from 'svelte/store';
import type {Proposal} from "$lib/types/governance";

export interface ProposalStore {
	proposal: Proposal | undefined;
}

export type ProposalStoreData = ProposalStore | undefined | null;

export interface ProposalContext {
	store: Writable<ProposalStoreData>;
	reset: () => void;
}

export const PROPOSAL_CONTEXT_KEY = Symbol('proposal');
