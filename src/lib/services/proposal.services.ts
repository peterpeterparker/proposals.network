import {
	getProposal as getProposalNns,
	makeAddNodeProviderProposal,
	makeCreateServiceNervousSystemProposal,
	makeMotionProposal as makeMotionProposalICP
} from '$lib/api/icp-proposal.api';
import {
	getProposal as getProposalSns,
	makeProposal as makeMotionProposalSns
} from '$lib/api/sns-proposal.api';
import { rootCanisterIdStore, snsNsFunctionsStore } from '$lib/derived/sns.derived';
import { toasts } from '$lib/stores/toasts.store';
import type { Governance, OptionGovernanceId, Proposal } from '$lib/types/governance';
import type {
	AddNodeProviderProposalParams,
	CreateServiceNervousSystemParams,
	MotionProposalParams,
	ProposalParams
} from '$lib/types/proposal.params';
import { mapIcpProposal } from '$lib/utils/icp-proposals.utils';
import { mapSnsProposal } from '$lib/utils/sns-proposals.utils';
import type { ProposalId } from '@dfinity/nns';
import { assertNonNullish, nonNullish } from '@dfinity/utils';
import { get } from 'svelte/store';

export const submitMotionProposal = async ({
	governance,
	...rest
}: MotionProposalParams): Promise<{
	result: 'ok' | 'error';
	proposalId: bigint | undefined;
}> => {
	const submit = async (governance: Governance): Promise<bigint | undefined> => {
		return governance.type === 'icp'
			? await makeMotionProposalICP({ ...rest })
			: await makeMotionProposalSns({ ...rest, governanceId: governance.id });
	};

	return submitProposal({
		governance,
		fn: submit
	});
};

export const submitAddNodeProviderProposal = async ({
	governance,
	...rest
}: AddNodeProviderProposalParams): Promise<{
	result: 'ok' | 'error';
	proposalId: bigint | undefined;
}> => {
	const submit = (): Promise<bigint | undefined> => {
		return makeAddNodeProviderProposal(rest);
	};

	return submitProposal({
		governance,
		fn: submit
	});
};

export const submitCreateServiceNervousSystemProposal = async ({
	governance,
	...rest
}: CreateServiceNervousSystemParams): Promise<{
	result: 'ok' | 'error';
	proposalId: bigint | undefined;
}> => {
	const submit = (): Promise<bigint | undefined> => {
		return makeCreateServiceNervousSystemProposal(rest);
	};

	return submitProposal({
		governance,
		fn: submit
	});
};

const submitProposal = async ({
	governance,
	fn
}: Pick<ProposalParams, 'governance'> & {
	fn: (governance: Governance) => Promise<bigint | undefined>;
}): Promise<{
	result: 'ok' | 'error';
	proposalId: bigint | undefined;
}> => {
	assertNonNullish(
		governance,
		'The governance details are not set, therefore no proposal can be submitted.'
	);

	try {
		const proposalId = await fn(governance);

		return { result: 'ok', proposalId };
	} catch (err: unknown) {
		toasts.error({
			msg: { text: 'The proposal cannot be submitted.' },
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
