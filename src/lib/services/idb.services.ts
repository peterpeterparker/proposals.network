import type { ProposalContent, ProposalEditableMetadata, ProposalMetadata } from '$lib/types/juno';
import type { Doc } from '@junobuild/core';
import { clear as clearIdb, createStore, get as getIdb, setMany } from 'idb-keyval';

const KEY_PROPOSAL_KEY = 'proposal-key';
const KEY_PROPOSAL_METADATA = 'proposal-metadata';
const KEY_PROPOSAL_CONTENT = 'proposal-content';
const KEY_PROPOSAL_DOC_METADATA = 'proposal-doc-metadata';
const KEY_PROPOSAL_DOC_CONTENT = 'proposal-doc-content';
const KEY_LAST_METADATA_CHANGE = 'last-metadata-change';
const KEY_LAST_CONTENT_CHANGE = 'last-content-change';
const KEY_LAST_METADATA_JOB = 'last-metadata-job';
const KEY_LAST_CONTENT_JOB = 'last-content-job';

const proposalsStore = createStore('pnwrk-proposals', 'proposals');

export const init = ({
	key,
	metadata,
	content,
	docMetadata,
	docContent,
	newProposal
}: {
	key: string;
	metadata: ProposalEditableMetadata | undefined;
	content: ProposalContent;
	docMetadata: Doc<ProposalMetadata> | undefined;
	docContent: Omit<Doc<ProposalContent>, 'data'> | undefined;
	newProposal: boolean;
}): Promise<void> =>
	setMany(
		[
			[KEY_LAST_METADATA_CHANGE, newProposal ? Date.now() : undefined],
			[KEY_LAST_CONTENT_CHANGE, newProposal ? Date.now() : undefined],
			[KEY_LAST_METADATA_JOB, undefined],
			[KEY_LAST_CONTENT_JOB, undefined],
			[KEY_PROPOSAL_KEY, key],
			[KEY_PROPOSAL_METADATA, metadata],
			[KEY_PROPOSAL_CONTENT, content],
			[KEY_PROPOSAL_DOC_METADATA, docMetadata],
			[KEY_PROPOSAL_DOC_CONTENT, docContent]
		],
		proposalsStore
	);

export const setContent = (content: ProposalContent): Promise<void> =>
	setMany(
		[
			[KEY_LAST_CONTENT_CHANGE, Date.now()],
			[KEY_PROPOSAL_CONTENT, content]
		],
		proposalsStore
	);

export const setMetadata = (metadata: ProposalEditableMetadata): Promise<void> =>
	setMany(
		[
			[KEY_LAST_METADATA_CHANGE, Date.now()],
			[KEY_PROPOSAL_METADATA, metadata]
		],
		proposalsStore
	);

export const getEditable = (): Promise<[ProposalEditableMetadata, ProposalContent]> =>
	Promise.all([
		getIdb(KEY_PROPOSAL_METADATA, proposalsStore),
		getIdb(KEY_PROPOSAL_CONTENT, proposalsStore)
	]);

export const updateMetadataDoc = ({
	docMetadata
}: {
	docMetadata: Doc<ProposalMetadata>;
}): Promise<void> =>
	setMany(
		[
			[KEY_LAST_METADATA_JOB, Date.now()],
			[KEY_PROPOSAL_DOC_METADATA, docMetadata]
		],
		proposalsStore
	);

export const updateContentDoc = ({
	docContent
}: {
	docContent: Omit<Doc<ProposalContent>, 'data'>;
}): Promise<void> =>
	setMany(
		[
			[KEY_LAST_METADATA_JOB, Date.now()],
			[KEY_PROPOSAL_DOC_CONTENT, docContent]
		],
		proposalsStore
	);

export const getMetadata = (): Promise<
	[string, ProposalEditableMetadata | undefined, Doc<ProposalMetadata> | undefined]
> =>
	Promise.all([
		getIdb(KEY_PROPOSAL_KEY, proposalsStore),
		getIdb(KEY_PROPOSAL_METADATA, proposalsStore),
		getIdb(KEY_PROPOSAL_DOC_METADATA, proposalsStore)
	]);

export const getContent = (): Promise<
	[string, ProposalContent | undefined, Omit<Doc<ProposalContent>, 'data'> | undefined]
> =>
	Promise.all([
		getIdb(KEY_PROPOSAL_KEY, proposalsStore),
		getIdb(KEY_PROPOSAL_CONTENT, proposalsStore),
		getIdb(KEY_PROPOSAL_DOC_CONTENT, proposalsStore)
	]);

export const getDocs = (): Promise<
	[Doc<ProposalMetadata> | undefined, Omit<Doc<ProposalContent>, 'data'> | undefined]
> =>
	Promise.all([
		getIdb(KEY_PROPOSAL_DOC_METADATA, proposalsStore),
		getIdb(KEY_PROPOSAL_DOC_CONTENT, proposalsStore)
	]);

export const getLastChangeMetadata = (): Promise<number | undefined> =>
	getIdb(KEY_LAST_METADATA_CHANGE, proposalsStore);

export const getLastChangeContent = (): Promise<number | undefined> =>
	getIdb(KEY_LAST_CONTENT_CHANGE, proposalsStore);

export const getLastJobMetadata = (): Promise<number | undefined> =>
	getIdb(KEY_LAST_METADATA_JOB, proposalsStore);

export const getLastJobContent = (): Promise<number | undefined> =>
	getIdb(KEY_LAST_CONTENT_JOB, proposalsStore);

export const clear = (): Promise<void> => clearIdb(proposalsStore);
