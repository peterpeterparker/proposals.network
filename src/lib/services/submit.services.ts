import template from '$lib/markdown/proposal-template.md?raw';
import {clear, getDocs as getDocsIdb, init} from '$lib/services/idb.services';
import { submitMotionProposal, type MotionProposalParams } from '$lib/services/proposal.services';
import { busy } from '$lib/stores/busy.store';
import { toasts } from '$lib/stores/toasts.store';
import type {ProposalContent, ProposalEditableMetadata, ProposalKey, ProposalMetadata} from '$lib/types/juno';
import type { UserOption } from '$lib/types/user';
import { replaceHistory } from '$lib/utils/route.utils';
import { isNullish } from '@dfinity/utils';
import { getDoc, setDoc, type Doc } from '@junobuild/core';
import { nanoid } from 'nanoid';

export let initUserProposal = async ({
	user,
	routeKey
}: {
	user: UserOption;
	routeKey: string | undefined | null;
}): Promise<{
	result: 'ok' | 'not_allowed' | 'error';
	metadata: ProposalEditableMetadata | undefined,
	content: ProposalContent | undefined;
}> => {
	if (isNullish(user)) {
		return { result: 'not_allowed', metadata: undefined, content: undefined };
	}

	try {
		if (isNullish(routeKey)) {
			const key = nanoid();
			const content = template;

			await Promise.all([
				init({
					key,
					content,
					metadata: undefined,
					docMetadata: undefined,
					docContent: undefined,
					newProposal: true
				}),
				updateUrl(key)
			]);

			return {
				result: 'ok',
				metadata: undefined,
				content
			};
		}
	} catch (err: unknown) {
		toasts.error({
			msg: { text: 'Something went wrong while initializing a new proposal.' },
			err
		});

		return { result: 'error', metadata: undefined, content: undefined };
	}

	try {
		const [docMetadata, docContent] = await getDocs(routeKey);

		if (isNullish(docMetadata)) {
			toasts.error({
				msg: { text: 'The metadata for the proposal key cannot be found.' }
			});

			return { result: 'error', metadata: undefined, content: undefined };
		}

		if (isNullish(docContent)) {
			toasts.error({
				msg: { text: 'The content of the proposal cannot be found.' }
			});

			return { result: 'error', metadata: undefined, content: undefined };
		}

		const {data, ...metadata} = docMetadata;
		const {title, url, motionText} = data;
		const editableMetadata = {title, url, motionText};

		const { data: jsonContent, ...content } = docContent;

		await init({
			key: routeKey,
			metadata: editableMetadata,
			content: jsonContent,
			docMetadata: {
				...metadata,
				data
			},
			docContent: content as Omit<Doc<ProposalMetadata>, 'data'> | undefined,
			newProposal: false
		});

		return {
			result: 'ok',
			metadata: editableMetadata,
			content: jsonContent
		};
	} catch (err: unknown) {
		toasts.error({
			msg: { text: 'Something went wrong while loading your proposal.' },
			err
		});

		return { result: 'error', metadata: undefined, content: undefined };
	}
};

const updateUrl = async (proposalKey: string) => {
	const url: URL = new URL(window.location.href);

	url.searchParams.delete('key');
	url.searchParams.append('key', encodeURI(proposalKey));

	replaceHistory(url);
};

export const submitProposal = async ({
	user,
	key,
	...rest
}: { user: UserOption; key: string } & MotionProposalParams): Promise<{
	result: 'ok' | 'error';
}> => {
	if (isNullish(user)) {
		toasts.error({
			msg: { text: 'You are not signed in.' }
		});
		return { result: 'error' };
	}

	busy.start();

	const [metadata, content] = await getDocs(key);

	if (isNullish(metadata) || isNullish(content)) {
		toasts.error({
			msg: { text: 'Invalid metadata and content to submit a proposal.' }
		});

		return { result: 'error' };
	}

	const value = await getDocsIdb();

	if (isNullish(value)) {
		toasts.error({
			msg: { text: 'No local data can be found. That is unexpected.' }
		});

		return { result: 'error' };
	}

	const [metadataIdb, contentIdb] = value;

	if (
		isNullish(metadata.updated_at) ||
		metadata.updated_at !== metadataIdb?.updated_at ||
		isNullish(content.updated_at) ||
		content.updated_at !== content?.updated_at
	) {
		toasts.error({
			msg: {
				text: 'Timestamps are no synced, therefore the proposal cannot be submitted. Maybe you edited the proposal on another device. Try to reload and retry.'
			}
		});

		return { result: 'error' };
	}

	const { result, proposalId } = await submitMotionProposal({
		user,
		...rest
	});

	if (result === 'error') {
		return { result: 'error' };
	}

	const resultUpdate = await updateMetadata({
		metadata,
		proposalId
	})

	await clear();

	busy.stop();

	return resultUpdate;
};

const updateMetadata = async ({
	metadata,
	proposalId
}: {
	metadata: Doc<ProposalMetadata>;
	proposalId: bigint | undefined;
}): Promise<{ result: 'ok' | 'error' }> => {
	try {
		await setDoc({
			collection: 'metadata',
			doc: {
				...metadata,
				data: {
					...metadata.data,
					proposalId,
					status: 'submitted'
				}
			}
		});

		return { result: 'ok' };
	} catch (err: unknown) {
		toasts.error({
			msg: { text: 'The proposal was submitted but the draft metadata could not be updated.' },
			err
		});
		return { result: 'error' };
	}
};

const getDocs = (
	key: ProposalKey
): Promise<[Doc<ProposalMetadata> | undefined, Doc<ProposalContent> | undefined]> =>
	Promise.all([
		getDoc<ProposalMetadata>({
			collection: 'metadata',
			key
		}),
		getDoc<ProposalContent>({
			collection: 'content',
			key
		})
	]);
