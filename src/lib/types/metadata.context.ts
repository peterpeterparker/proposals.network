import type { ProposalEditableMetadata } from '$lib/types/juno';
import type { Writable } from 'svelte/store';

export interface MetadataStore {
	metadata: ProposalEditableMetadata | undefined | null;
}

export type MetadataStoreData = MetadataStore | undefined | null;

export interface MetadataContext {
	store: Writable<MetadataStoreData>;
	reload: () => Promise<void>;
}

export const METADATA_CONTEXT_KEY = Symbol('submit-metadata');
