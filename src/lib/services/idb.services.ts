import type { ProposalContent, ProposalMetadata } from '$lib/types/juno';
import type { Doc } from '@junobuild/core';
import { clear as clearIdb, createStore, get as getIdb, setMany } from 'idb-keyval';

const KEY_PROPOSAL_KEY = 'proposal-key';
const KEY_PROPOSAL_CONTENT = 'proposal-content';
const KEY_PROPOSAL_DOC_METADATA = 'proposal-doc-metadata';
const KEY_PROPOSAL_DOC_CONTENT = 'proposal-doc-content';
const KEY_LAST_CHANGE = 'last-change';
const KEY_LAST_JOB = 'last-job';

const proposalsStore = createStore('pnwrk-proposals', 'proposals');

export const init = ({
	key,
	content,
	docMetadata,
	docContent,
	newProposal
}: {
	key: string;
	content: ProposalContent;
	docMetadata: Doc<ProposalMetadata> | undefined;
	docContent: Omit<Doc<ProposalContent>, 'data'> | undefined;
	newProposal: boolean;
}): Promise<void> =>
	setMany(
		[
			[KEY_LAST_CHANGE, newProposal ? Date.now() : undefined],
			[KEY_LAST_JOB, undefined],
			[KEY_PROPOSAL_KEY, key],
			[KEY_PROPOSAL_CONTENT, content],
			[KEY_PROPOSAL_DOC_METADATA, docMetadata],
			[KEY_PROPOSAL_DOC_CONTENT, docContent]
		],
		proposalsStore
	);

export const setContent = (content: ProposalContent): Promise<void> =>
	setMany(
		[
			[KEY_LAST_CHANGE, Date.now()],
			[KEY_PROPOSAL_CONTENT, content]
		],
		proposalsStore
	);

export const updateDocs = ({
	docMetadata,
	docContent
}: {
	docMetadata: Doc<ProposalMetadata> | undefined;
	docContent: Omit<Doc<ProposalContent>, 'data'> | undefined;
}): Promise<void> =>
	setMany(
		[
			[KEY_LAST_JOB, Date.now()],
			[KEY_PROPOSAL_DOC_METADATA, docMetadata],
			[KEY_PROPOSAL_DOC_CONTENT, docContent]
		],
		proposalsStore
	);

export const get = (): Promise<
	[
		string,
		ProposalContent,
		Doc<ProposalMetadata> | undefined,
		Omit<Doc<ProposalContent>, 'data'> | undefined
	]
> =>
	Promise.all([
		getIdb(KEY_PROPOSAL_KEY, proposalsStore),
		getIdb(KEY_PROPOSAL_CONTENT, proposalsStore),
		getIdb(KEY_PROPOSAL_DOC_METADATA, proposalsStore),
		getIdb(KEY_PROPOSAL_DOC_CONTENT, proposalsStore)
	]);

export const getDocs = (): Promise<
	[Doc<ProposalMetadata> | undefined, Omit<Doc<ProposalContent>, 'data'> | undefined]
> =>
	Promise.all([
		getIdb(KEY_PROPOSAL_DOC_METADATA, proposalsStore),
		getIdb(KEY_PROPOSAL_DOC_CONTENT, proposalsStore)
	]);

export const getLastChange = (): Promise<number | undefined> =>
	getIdb(KEY_LAST_CHANGE, proposalsStore);

export const getLastJob = (): Promise<number | undefined> => getIdb(KEY_LAST_JOB, proposalsStore);

export const clear = (): Promise<void> => clearIdb(proposalsStore);
