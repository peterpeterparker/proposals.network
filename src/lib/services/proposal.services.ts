import {
	getProposal as getProposalNns,
	makeProposal as makeProposalICP
} from '$lib/api/icp-proposal.api';
import {
	getProposal as getProposalSns,
	makeProposal as makeProposalSns
} from '$lib/api/sns-proposal.api';
import { rootCanisterIdStore, snsNsFunctionsStore } from '$lib/derived/sns.derived';
import { toasts } from '$lib/stores/toasts.store';
import type { Governance, OptionGovernanceId, Proposal } from '$lib/types/governance';
import { mapIcpProposal } from '$lib/utils/icp-proposals.utils';
import { mapSnsProposal } from '$lib/utils/sns-proposals.utils';
import type { MakeProposalRequest, Motion, ProposalId } from '@dfinity/nns';
import { assertNonNullish, nonNullish } from '@dfinity/utils';
import { get } from 'svelte/store';

export type MotionProposalParams = Omit<MakeProposalRequest, 'action' | 'title' | 'neuronId'> & {
	neuronId: string;
	title: string;
	governance: Governance | undefined;
} & Motion;

export const submitMotionProposal = async ({
	governance,
	...rest
}: MotionProposalParams): Promise<{
	result: 'ok' | 'error';
	proposalId: bigint | undefined;
}> => {
	assertNonNullish(
		governance,
		'The governance details are not set, therefore no proposal can be submitted.'
	);

	try {
		const proposalId =
			governance.type === 'icp'
				? await makeProposalICP({ ...rest })
				: await makeProposalSns({ ...rest, governanceId: governance.id });

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
	governanceId,
	type,
	proposalId
}: {
	governanceId: OptionGovernanceId;
	type: 'icp' | 'sns';
	proposalId: ProposalId;
}): Promise<Proposal | undefined> => {
	assertNonNullish(
		governanceId,
		'The governance canister ID is not set, therefore no proposal can be loaded.'
	);

	if (type === 'sns') {
		const proposal = await getProposalSns({ proposalId, governanceCanisterId: governanceId });

		const nsFunctions = get(snsNsFunctionsStore);
		const rootCanisterId = get(rootCanisterIdStore);

		return nonNullish(proposal)
			? mapSnsProposal({ proposal, nsFunctions, rootCanisterId })
			: undefined;
	}

	const proposal = await getProposalNns({ proposalId });
	return nonNullish(proposal) ? mapIcpProposal(proposal) : undefined;
};
