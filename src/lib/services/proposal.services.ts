import { getProposal as getProposalNns, makeProposal } from '$lib/api/icp-proposal.api';
import { getProposal as getProposalSns } from '$lib/api/sns-proposal.api';
import { rootCanisterIdStore, snsNsFunctionsStore } from '$lib/derived/sns.derived';
import { toasts } from '$lib/stores/toasts.store';
import type { GovernanceCanisterId } from '$lib/types/core';
import type { Proposal } from '$lib/types/governance';
import { mapIcpProposal } from '$lib/utils/icp-proposals.utils';
import { mapSnsProposal } from '$lib/utils/sns-proposals.utils';
import type { MakeProposalRequest, Motion, ProposalId } from '@dfinity/nns';
import { assertNonNullish, nonNullish } from '@dfinity/utils';
import { get } from 'svelte/store';

export type MotionProposalParams = Omit<MakeProposalRequest, 'action' | 'title'> & {
	title: string;
} & Motion;

export const submitMotionProposal = async (
	params: MotionProposalParams
): Promise<{
	result: 'ok' | 'error';
	proposalId: bigint | undefined;
}> => {
	try {
		const proposalId = await makeProposal(params);

		return { result: 'ok', proposalId };
	} catch (err: unknown) {
		toasts.error({
			msg: { text: 'The proposal cannot be submitted to the ICP governance.' },
			err
		});
		return { result: 'error', proposalId: undefined };
	}
};

export const getProposal = async ({
	governanceCanisterId,
	type,
	proposalId
}: {
	governanceCanisterId: GovernanceCanisterId | undefined | null;
	type: 'icp' | 'sns';
	proposalId: ProposalId;
}): Promise<Proposal | undefined> => {
	assertNonNullish(
		governanceCanisterId,
		'The governance canister ID is not set, therefore no proposal can be loaded.'
	);

	if (type === 'sns') {
		const proposal = await getProposalSns({ proposalId, governanceCanisterId });

		const nsFunctions = get(snsNsFunctionsStore);
		const rootCanisterId = get(rootCanisterIdStore);

		return nonNullish(proposal)
			? mapSnsProposal({ proposal, nsFunctions, rootCanisterId })
			: undefined;
	}

	const proposal = await getProposalNns({ proposalId });
	return nonNullish(proposal) ? mapIcpProposal(proposal) : undefined;
};
