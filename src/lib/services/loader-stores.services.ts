import { GOVERNANCE_CANISTER_ID } from '$lib/constants/app.constants';
import { toasts } from '$lib/stores/toasts.store';
import { userProposalsStore, type UserProposalsSetData } from '$lib/stores/user-proposals.store';
import { userStore } from '$lib/stores/user.store';
import type { ProposalMetadata, ProposalToken } from '$lib/types/juno';
import type { Store } from '$lib/types/store';
import { isNullish } from '@dfinity/utils';
import { listDocs } from '@junobuild/core';
import { get } from 'svelte/store';

export const loadUserProposals = (): Promise<{ success: boolean }> =>
	loadPrivate({
		fn: async (token: ProposalToken): Promise<UserProposalsSetData> => {
			const proposals = await listDocs<ProposalMetadata>({
				collection: 'metadata',
				filter: {
					matcher: {
						description: token
					},
					order: {
						desc: true,
						field: "created_at"
					}
				}
			});

			return {
				token,
				proposals
			};
		},
		store: userProposalsStore,
		errorLabel: 'Unexpected error while loading your proposals'
	});

const loadPrivate = async <T, D>(params: {
	fn: (token: ProposalToken) => Promise<D>;
	store: Store<T, D>;
	errorLabel: string;
}): Promise<{ success: boolean }> => {
	const user = get(userStore);

	if (isNullish(user)) {
		toasts.error({
			msg: { text: 'You are not signed in.' }
		});
		return { success: false };
	}

	if (isNullish(GOVERNANCE_CANISTER_ID)) {
		toasts.error({
			msg: {
				text: 'The ICP governance canister ID is not set, therefore not proposals can be fetched.'
			}
		});
		return { success: false };
	}

	return load({
		...params,
		token: GOVERNANCE_CANISTER_ID
	});
};

const load = async <T, D>({
	fn,
	store,
	errorLabel,
	token
}: {
	fn: (token: ProposalToken) => Promise<D>;
	store: Store<T, D>;
	errorLabel: string;
	token: ProposalToken;
}): Promise<{ success: boolean }> => {
	try {
		const data = await fn(token);
		store.set(data);
	} catch (err: unknown) {
		store.reset();

		toasts.error({
			msg: { text: errorLabel },
			err
		});

		return { success: false };
	}

	return { success: true };
};
