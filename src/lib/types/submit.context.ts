import type { ProposalEditableMetadata, ProposalKey } from '$lib/types/juno';
import type { Writable } from 'svelte/store';

export interface SubmitStore {
	metadata: ProposalEditableMetadata | undefined | null;
	key: ProposalKey | undefined | null;
}

export type SubmitStoreData = SubmitStore | undefined | null;

export interface SubmitContext {
	store: Writable<SubmitStoreData>;
	reload: () => Promise<void>;
}

export const SUBMIT_CONTEXT_KEY = Symbol('submit');
