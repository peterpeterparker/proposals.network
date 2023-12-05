import { listProposals } from '$lib/api/proposal.api';
import { GOVERNANCE_CANISTER_ID, USER_PAGINATION } from '$lib/constants/app.constants';
import { proposalsStore, type ProposalsSetData } from '$lib/stores/proposals.store';
import { toasts } from '$lib/stores/toasts.store';
import { userProposalsStore, type UserProposalsSetData } from '$lib/stores/user-proposals.store';
import { userStore } from '$lib/stores/user.store';
import type { GovernanceCanisterId } from '$lib/types/core';
import type { ProposalMetadata } from '$lib/types/juno';
import type { Store } from '$lib/types/store';
import type { ProposalId } from '@dfinity/nns';
import { isNullish } from '@dfinity/utils';
import type { ListPaginate } from '@junobuild/core';
import { listDocs } from '@junobuild/core';
import { get } from 'svelte/store';

export const loadUserProposals = ({
	startAfter
}: Pick<ListPaginate, 'startAfter'>): Promise<{ success: boolean }> =>
	loadPrivate({
		fn: async (governanceCanisterId: GovernanceCanisterId): Promise<UserProposalsSetData> => {
			const proposals = await listDocs<ProposalMetadata>({
				collection: 'metadata',
				filter: {
					matcher: {
						description: governanceCanisterId
					},
					order: {
						desc: true,
						field: 'created_at'
					},
					paginate: {
						limit: USER_PAGINATION,
						startAfter
					}
				}
			});

			return {
				governanceCanisterId,
				proposals
			};
		},
		store: userProposalsStore,
		errorLabel: 'Unexpected error while loading your proposals'
	});

export const loadProposals = ({ beforeProposal }: { beforeProposal: ProposalId | undefined }) =>
	load({
		fn: async (governanceCanisterId: GovernanceCanisterId): Promise<ProposalsSetData> => {
			const { proposals } = await listProposals(beforeProposal);

			return {
				governanceCanisterId,
				proposals
			};
		},
		store: proposalsStore,
		errorLabel: 'Unexpected error while loading the network proposals'
	});

const loadPrivate = async <T, D>(params: {
	fn: (governanceCanisterId: GovernanceCanisterId) => Promise<D>;
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

	return load(params);
};

const load = async <T, D>({
	fn,
	store,
	errorLabel
}: {
	fn: (governanceCanisterId: GovernanceCanisterId) => Promise<D>;
	store: Store<T, D>;
	errorLabel: string;
}): Promise<{ success: boolean }> => {
	if (isNullish(GOVERNANCE_CANISTER_ID)) {
		toasts.error({
			msg: {
				text: 'The ICP governance canister ID is not set, therefore not proposals can be fetched.'
			}
		});
		return { success: false };
	}

	try {
		const data = await fn(GOVERNANCE_CANISTER_ID);
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
