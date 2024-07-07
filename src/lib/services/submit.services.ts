import template from '$lib/markdown/proposal-template.md?raw';
import {
	clear,
	getDocMetadata,
	getDocs as getDocsIdb,
	getEditable,
	init
} from '$lib/services/idb.services';
import {
	submitAddNodeProviderProposal as submitAddNodeProviderProposalApi,
	submitMotionProposal as submitMotionProposalApi,
	type ProposalParams
} from '$lib/services/proposal.services';
import { busy } from '$lib/stores/busy.store';
import { toasts } from '$lib/stores/toasts.store';
import type {
	ProposalContent,
	ProposalEditableMetadata,
	ProposalKey,
	ProposalMetadata
} from '$lib/types/juno';
import type { UserOption } from '$lib/types/user';
import { replaceHistory } from '$lib/utils/route.utils';
import { assertSHA256, assertUrlsFromWiki } from '$lib/utils/submit.node-provider.utils';
import { isNullish, notEmptyString } from '@dfinity/utils';
import { getDoc, setDoc, type Doc } from '@junobuild/core-peer';
import { nanoid } from 'nanoid';

export const initUserProposal = async ({
	user,
	routeKey
}: {
	user: UserOption;
	routeKey: string | undefined | null;
}): Promise<{
	result: 'ok' | 'not_allowed' | 'error' | 'readonly';
	metadata: ProposalEditableMetadata | undefined;
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

		const { data, ...metadata } = docMetadata;
		const {
			title,
			url,
			motionText,
			summary,
			nodeProviderId,
			nodeProviderName,
			urlIdentityProof,
			urlSelfDeclaration,
			hashIdentityProof,
			hashSelfDeclaration,
			proposalAction
		} = data;
		const editableMetadata = {
			title,
			url,
			motionText,
			summary,
			nodeProviderName,
			nodeProviderId,
			urlIdentityProof,
			urlSelfDeclaration,
			hashIdentityProof,
			hashSelfDeclaration,
			proposalAction
		};

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
			result: data.status === 'submitted' ? 'readonly' : 'ok',
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

export interface SubmitProposalResult {
	result: 'ok' | 'error';
	proposalId?: bigint | undefined;
}

export const submitMotionProposal = async ({
	neuronId,
	governance,
	...rest
}: {
	user: UserOption;
} & Partial<Pick<ProposalParams, 'neuronId' | 'governance'>>): Promise<SubmitProposalResult> => {
	const submit = async ({
		metadata,
		neuronId
	}: { metadata: ProposalEditableMetadata } & Pick<
		ProposalParams,
		'neuronId'
	>): Promise<SubmitProposalResult> => {
		const { title, url, motionText } = metadata;

		if (isNullish(title) || isNullish(url) || isNullish(motionText)) {
			toasts.error({
				msg: { text: 'No title, url or motion text to submit the proposal.' }
			});
			return { result: 'error' };
		}

		const [_, content] = await getEditable();

		if (isNullish(content)) {
			toasts.error({
				msg: { text: 'No content to submit the proposal.' }
			});
			return { result: 'error' };
		}

		return submitMotionProposalApi({
			title,
			url,
			motionText,
			summary: content,
			neuronId,
			governance
		});
	};

	return submitProposal({
		neuronId,
		fn: submit,
		...rest
	});
};

export const submitAddNodeProviderProposal = async ({
	neuronId,
	governance,
	...rest
}: {
	user: UserOption;
} & Partial<Pick<ProposalParams, 'neuronId' | 'governance'>>): Promise<SubmitProposalResult> => {
	const submit = async ({
		metadata,
		neuronId
	}: { metadata: ProposalEditableMetadata } & Pick<
		ProposalParams,
		'neuronId'
	>): Promise<SubmitProposalResult> => {
		const { url, nodeProviderId, title } = metadata;

		if (isNullish(url) || isNullish(nodeProviderId) || isNullish(title)) {
			toasts.error({
				msg: { text: 'No title, url or node provider ID to submit the proposal.' }
			});
			return { result: 'error' };
		}

		const summary = `Register a node provider '${metadata?.nodeProviderName}', in line with the announcement and discussion at [${metadata?.url}](${metadata?.url}).\n\nThe self-declaration documentation is available at [${metadata?.urlSelfDeclaration}](${metadata?.urlSelfDeclaration}) with SHA256 hash \`${metadata?.hashSelfDeclaration}\`.\n\nThe proof of identity is available at [${metadata?.urlIdentityProof}](${metadata?.urlIdentityProof}) with SHA256 hash \`${metadata?.hashIdentityProof}\`.`;

		return submitAddNodeProviderProposalApi({
			title,
			url,
			id: nodeProviderId,
			rewardAccount: undefined,
			summary,
			neuronId,
			governance
		});
	};

	return submitProposal({
		neuronId,
		fn: submit,
		...rest
	});
};

const submitProposal = async ({
	user,
	neuronId,
	fn
}: {
	user: UserOption;
	fn: (
		params: { metadata: ProposalEditableMetadata } & Pick<ProposalParams, 'neuronId'>
	) => Promise<SubmitProposalResult>;
} & Partial<Pick<ProposalParams, 'neuronId'>>): Promise<SubmitProposalResult> => {
	if (isNullish(user)) {
		toasts.error({
			msg: { text: 'You are not signed in.' }
		});
		return { result: 'error' };
	}

	if (isNullish(neuronId)) {
		toasts.error({
			msg: { text: 'A neuron ID must be provided to submit a proposal.' }
		});
		return { result: 'error' };
	}

	busy.start();

	try {
		await assertTimestamps();

		const [metadata] = await getEditable();

		if (isNullish(metadata)) {
			toasts.error({
				msg: { text: 'No metadata to submit the proposal.' }
			});
			return { result: 'error' };
		}

		const { result, proposalId } = await fn({ metadata, neuronId });

		if (result === 'error') {
			return { result: 'error' };
		}

		const { result: resultUpdate } = await updateMetadata({
			proposalId
		});

		await clear();

		busy.stop();

		return { result: resultUpdate, proposalId };
	} finally {
		busy.stop();
	}
};

const updateMetadata = async ({
	proposalId
}: {
	proposalId: bigint | undefined;
}): Promise<{ result: 'ok' | 'error' }> => {
	try {
		const metadata = await getDocMetadata();

		if (isNullish(metadata)) {
			toasts.error({
				msg: { text: 'The proposal was submitted but no metadata were found to update the status.' }
			});
			return { result: 'error' };
		}

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

const assertTimestamps = async () => {
	const value = await getDocsIdb();

	if (isNullish(value)) {
		throw new Error('No local data can be found. That is unexpected');
	}

	const [key, docMetadataIdb, docContentIdb] = value;

	const [docMetadata, docContent] = await getDocs(key);

	if (isNullish(docMetadata) || isNullish(docContent)) {
		throw new Error("'Invalid metadata and content saved on chain to submit a proposal.'");
	}

	if (
		isNullish(docMetadata.version) ||
		docMetadata.version !== docMetadataIdb?.version ||
		isNullish(docContent.version) ||
		docContent.version !== docContentIdb?.version
	) {
		throw new Error(
			'Timestamps are no synced, therefore the proposal cannot be submitted. Maybe you edited the proposal on another device. Try to reload and retry'
		);
	}
};

export const assertAddNodeProviderMetadata = async (
	metadata: ProposalEditableMetadata | undefined | null
): Promise<{ valid: boolean }> => {
	if (isNullish(metadata)) {
		toasts.error({ msg: { text: 'No metadata have been edited.' } });
		return { valid: false };
	}

	const {
		nodeProviderName,
		url,
		urlSelfDeclaration,
		hashSelfDeclaration,
		urlIdentityProof,
		hashIdentityProof,
		nodeProviderId
	} = metadata;

	const allFieldsPresent = (...fields: (string | undefined)[]): boolean => {
		return fields.every(notEmptyString);
	};

	if (
		!allFieldsPresent(
			nodeProviderName,
			url,
			urlSelfDeclaration,
			hashSelfDeclaration,
			urlIdentityProof,
			hashIdentityProof,
			nodeProviderId
		)
	) {
		toasts.error({
			msg: { text: 'Please fill in all required fields to submit a new node provider.' }
		});
		return { valid: false };
	}

	const { err, reason, valid } = assertUrlsFromWiki({
		urlIdentityProof,
		urlSelfDeclaration
	});

	if (!valid) {
		toasts.error({
			msg: { text: reason ?? 'Provided URLs are invalid.' },
			err
		});
		return { valid: false };
	}

	const { reason: reasonSh256, valid: validSha256 } = assertSHA256({
		hashIdentityProof,
		hashSelfDeclaration
	});

	if (!validSha256) {
		toasts.error({
			msg: { text: reasonSh256 ?? 'Invalid Sha256 provided for the documents.' }
		});
		return { valid: false };
	}

	return { valid: true };
};
