import { EDITOR_EXTENSIONS } from '$lib/constants/editor.constants';
import template from '$lib/markdown/proposal-template.md?raw';
import { init } from '$lib/services/idb.services';
import { toasts } from '$lib/stores/toasts.store';
import type { ProposalContent, ProposalMetadata } from '$lib/types/juno';
import type { UserOption } from '$lib/types/user';
import { markdownToHTML } from '$lib/utils/markdown.utils';
import { replaceHistory } from '$lib/utils/route.utils';
import { isNullish } from '@dfinity/utils';
import { getDoc, type Doc } from '@junobuild/core';
import { generateJSON } from '@tiptap/core';
import { nanoid } from 'nanoid';

export let initUserProposal = async ({
	user,
	routeKey
}: {
	user: UserOption;
	routeKey: string | undefined | null;
}): Promise<{
	result: 'ok' | 'not_allowed' | 'error';
	key: string | undefined;
	content: ProposalContent | undefined;
}> => {
	if (isNullish(user)) {
		return { result: 'not_allowed', key: undefined, content: undefined };
	}

	try {
		if (isNullish(routeKey)) {
			const key = nanoid();
			const content = generateJSON(await markdownToHTML(template), EDITOR_EXTENSIONS);

			await Promise.all([
				init({
					key,
					content,
					docMetadata: undefined,
					docContent: undefined,
					newProposal: true
				}),
				updateUrl(key)
			]);

			return {
				result: 'ok',
				key,
				content
			};
		}
	} catch (err: unknown) {
		toasts.error({
			msg: { text: 'Something went wrong while initializing a new proposal.' },
			err
		});

		return { result: 'error', key: undefined, content: undefined };
	}

	try {
		const [metadata, docContent] = await Promise.all([
			getDoc<ProposalMetadata>({
				collection: 'metadata',
				key: routeKey
			}),
			getDoc<ProposalContent>({
				collection: 'content',
				key: routeKey
			})
		]);

		if (isNullish(metadata)) {
			toasts.error({
				msg: { text: 'The metadata for the proposal key cannot be found.' }
			});

			return { result: 'error', key: undefined, content: undefined };
		}

		if (isNullish(docContent)) {
			toasts.error({
				msg: { text: 'The content of the proposal cannot be found.' }
			});

			return { result: 'error', key: undefined, content: undefined };
		}

		const { data: jsonContent, ...content } = docContent;

		await init({
			key: routeKey,
			content: jsonContent,
			docMetadata: metadata,
			docContent: content as Omit<Doc<ProposalMetadata>, 'data'> | undefined,
			newProposal: false
		});

		return {
			result: 'ok',
			key: routeKey,
			content: jsonContent
		};
	} catch (err: unknown) {
		toasts.error({
			msg: { text: 'Something went wrong while loading your proposal.' },
			err
		});

		return { result: 'error', key: undefined, content: undefined };
	}
};

const updateUrl = async (proposalKey: string) => {
	const url: URL = new URL(window.location.href);

	url.searchParams.delete('key');
	url.searchParams.append('key', encodeURI(proposalKey));

	replaceHistory(url);
};
