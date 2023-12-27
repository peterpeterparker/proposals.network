import { listIcpProposals } from '$lib/api/icp-proposal.api';
import { listSnsProposals } from '$lib/api/sns-proposal.api';
import { USER_PAGINATION } from '$lib/constants/app.constants';
import { rootCanisterIdStore, snsNsFunctionsStore } from '$lib/derived/sns.derived';
import { proposalsStore, type ProposalsSetData } from '$lib/stores/proposals.store';
import { toasts } from '$lib/stores/toasts.store';
import { userProposalsStore, type UserProposalsSetData } from '$lib/stores/user-proposals.store';
import { userStore } from '$lib/stores/user.store';
import type { GovernanceCanisterId } from '$lib/types/core';
import type { OptionGovernanceId } from '$lib/types/governance';
import type { ProposalMetadata } from '$lib/types/juno';
import type { Store } from '$lib/types/store';
import { mapIcpProposal } from '$lib/utils/icp-proposals.utils';
import { mapSnsProposal } from '$lib/utils/sns-proposals.utils';
import type { ProposalId } from '@dfinity/nns';
import { isNullish } from '@dfinity/utils';
import type { ListPaginate } from '@junobuild/core-peer';
import { listDocs } from '@junobuild/core-peer';
import { get } from 'svelte/store';

export const loadUserProposals = ({
	startAfter,
	governanceId
}: Pick<ListPaginate, 'startAfter'> & { governanceId: OptionGovernanceId }): Promise<{
	success: boolean;
}> =>
	loadPrivate({
		governanceCanisterId: governanceId,
		fn: async (_governanceCanisterId: GovernanceCanisterId): Promise<UserProposalsSetData> => {
			const proposals = await listDocs<ProposalMetadata>({
				collection: 'metadata',
				filter: {
					// TODO: to be used the day we want to display the user proposals per governance as well
					// matcher: {
					// 	description: governanceCanisterId
					// },
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
				proposals
			};
		},
		store: userProposalsStore,
		errorLabel: 'Unexpected error while loading your proposals'
	});

export const loadProposals = ({
	beforeProposal,
	governanceCanisterId,
	type
}: {
	beforeProposal: ProposalId | undefined;
	governanceCanisterId: GovernanceCanisterId | undefined | null;
	type: 'icp' | 'sns';
}) =>
	load({
		governanceCanisterId,
		fn: async (governanceCanisterId: GovernanceCanisterId): Promise<ProposalsSetData> => {
			if (type === 'sns') {
				const proposals = await listSnsProposals({ beforeProposal, governanceCanisterId });

				const nsFunctions = get(snsNsFunctionsStore);
				const rootCanisterId = get(rootCanisterIdStore);

				return {
					governanceCanisterId,
					proposals: proposals.map((proposal) =>
						mapSnsProposal({ proposal, nsFunctions, rootCanisterId })
					)
				};
			}

			const { proposals } = await listIcpProposals(beforeProposal);

			return {
				governanceCanisterId,
				proposals: proposals.map(mapIcpProposal)
			};
		},
		store: proposalsStore,
		errorLabel: 'Unexpected error while loading the network proposals'
	});

const loadPrivate = async <T, D>(params: {
	governanceCanisterId: GovernanceCanisterId | undefined | null;
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
	governanceCanisterId,
	fn,
	store,
	errorLabel
}: {
	governanceCanisterId: GovernanceCanisterId | undefined | null;
	fn: (governanceCanisterId: GovernanceCanisterId) => Promise<D>;
	store: Store<T, D>;
	errorLabel: string;
}): Promise<{ success: boolean }> => {
	if (isNullish(governanceCanisterId)) {
		toasts.error({
			msg: {
				text: 'The governance canister ID is not set, therefore not proposals can be fetched.'
			}
		});
		return { success: false };
	}

	try {
		const data = await fn(governanceCanisterId);
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
