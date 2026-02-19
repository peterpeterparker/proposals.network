import { getAgent } from '$lib/api/agent.api';
import { NETWORK_PAGINATION } from '$lib/constants/app.constants';
import type { GovernanceId } from '$lib/types/governance';
import type { SnsProposal } from '$lib/types/ic-js';
import type {
	MotionProposalParams,
	ProposalParams,
	TransferTreasuryFundsParams
} from '$lib/types/proposal.params';
import { fromNullable, hexStringToUint8Array, nonNullish } from '@dfinity/utils';
import type { ProposalId } from '@icp-sdk/canisters/nns';
import { SnsGovernanceCanister, type SnsGovernanceDid } from '@icp-sdk/canisters/sns';
import { AnonymousIdentity } from '@icp-sdk/core/agent';
import { Principal } from '@icp-sdk/core/principal';
import { unsafeIdentity } from '@junobuild/core';

export const listSnsProposals = async ({
	governanceCanisterId,
	beforeProposal
}: {
	beforeProposal: ProposalId | undefined;
	governanceCanisterId: GovernanceId;
}): Promise<SnsGovernanceDid.ListProposalsResponse> => {
	const agent = await getAgent({ identity: new AnonymousIdentity() });

	const { listProposals } = SnsGovernanceCanister.create({
		agent,
		canisterId: Principal.fromText(governanceCanisterId)
	});

	return listProposals({
		limit: NETWORK_PAGINATION,
		beforeProposal: nonNullish(beforeProposal) ? { id: beforeProposal } : undefined,
		certified: false
	});
};

export const getProposal = async ({
	proposalId,
	governanceCanisterId
}: {
	proposalId: ProposalId;
	governanceCanisterId: GovernanceId;
}): Promise<SnsGovernanceDid.ProposalData | undefined> => {
	const agent = await getAgent({ identity: new AnonymousIdentity() });

	const { getProposal } = SnsGovernanceCanister.create({
		agent,
		canisterId: Principal.fromText(governanceCanisterId)
	});

	return getProposal({ proposalId: { id: proposalId }, certified: false });
};

export const makeMotionProposal = async ({
	motionText,
	...rest
}: Omit<MotionProposalParams, 'governance'> & { governanceId: GovernanceId }): Promise<
	ProposalId | undefined
> => {
	return await makeProposal({
		action: {
			Motion: {
				motion_text: motionText
			}
		},
		...rest
	});
};

export const makeTransferTreasuryFundsProposal = async ({
	transferFunds: TransferSnsTreasuryFunds,
	...rest
}: Omit<TransferTreasuryFundsParams, 'governance'> & { governanceId: GovernanceId }): Promise<
	ProposalId | undefined
> => {
	return await makeProposal({
		action: {
			TransferSnsTreasuryFunds
		},
		...rest
	});
};

const makeProposal = async ({
	url,
	summary,
	title,
	neuronId,
	action,
	governanceId
}: Omit<ProposalParams, 'governance'> & {
	governanceId: GovernanceId;
	action: SnsGovernanceDid.Action;
}): Promise<ProposalId | undefined> => {
	const agent = await getAgent({ identity: await unsafeIdentity() });

	const { manageNeuron } = SnsGovernanceCanister.create({
		agent,
		canisterId: Principal.fromText(governanceId)
	});

	const toManageNeuronCommand = ({
		neuronId: { id },
		command
	}: {
		neuronId: SnsGovernanceDid.NeuronId;
		command: { MakeProposal: SnsProposal };
	}): SnsGovernanceDid.ManageNeuron => ({
		subaccount: id,
		command: [command]
	});

	const toMakeProposalRequest = (): SnsGovernanceDid.ManageNeuron =>
		toManageNeuronCommand({
			neuronId: { id: hexStringToUint8Array(neuronId) },
			command: {
				MakeProposal: {
					url,
					summary,
					title,
					action: [action]
				}
			}
		});

	const request = toMakeProposalRequest();
	const result = await manageNeuron(request);

	const command = fromNullable(result?.command);

	if (nonNullish(command) && 'Error' in command) {
		throw new Error(command.Error.error_message);
	}

	return nonNullish(command) && 'MakeProposal' in command
		? fromNullable(command.MakeProposal.proposal_id)?.id
		: undefined;
};
