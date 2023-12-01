import type { ProposalContent } from '$lib/types/juno';
import { clear as clearIdb, createStore, get as getIdb, setMany } from 'idb-keyval';

const KEY_PROPOSAL_KEY = 'proposal-key';
const KEY_PROPOSAL_TITLE = 'proposal-title';
const KEY_PROPOSAL_CONTENT = 'proposal-content';
const KEY_LAST_CHANGE = 'last-change';

const proposalsStore = createStore('pnwrk-proposals', 'proposals');

export const set = ({ key, title, content }: { key: string; title: string; content: ProposalContent }): Promise<void> =>
	setMany(
		[
			[KEY_LAST_CHANGE, Date.now()],
			[KEY_PROPOSAL_KEY, key],
			[KEY_PROPOSAL_TITLE, title],
			[KEY_PROPOSAL_CONTENT, content]
		],
		proposalsStore
	);

export const get = (): Promise<[string, string, ProposalContent]> =>
	Promise.all([
		getIdb(KEY_PROPOSAL_KEY, proposalsStore),
		getIdb(KEY_PROPOSAL_TITLE, proposalsStore),
		getIdb(KEY_PROPOSAL_CONTENT, proposalsStore)
	]);

export const getLastChange = (): Promise<number | undefined> =>
	getIdb(KEY_LAST_CHANGE, proposalsStore);

export const clear = (): Promise<void> => clearIdb(proposalsStore);
