import type { ProposalEditableMetadata, ProposalKey, StorageSnsCollections } from '$lib/types/juno';
import type { Writable } from 'svelte/store';

export interface SubmitStore {
	metadata: ProposalEditableMetadata | undefined | null;
	key: ProposalKey | undefined | null;
}

export type SubmitStoreData = SubmitStore | undefined | null;

export type SubmitDownloadUrl = string;
export type SubmitAssetsStore = Record<StorageSnsCollections, SubmitDownloadUrl | undefined>;

export type SubmitAssetsStoreData = SubmitAssetsStore | undefined | null;

export interface SubmitContext {
	store: Writable<SubmitStoreData>;
	reload: () => Promise<void>;
	assets: Writable<SubmitAssetsStoreData>;
}

export const SUBMIT_CONTEXT_KEY = Symbol('submit');
