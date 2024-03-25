import { getAgent } from '$lib/api/agent.api';
import { NETWORK_PAGINATION } from '$lib/constants/app.constants';
import type { MotionProposalParams } from '$lib/services/proposal.services';
import type { GovernanceId } from '$lib/types/governance';
import type { SnsProposal } from '$lib/types/ic-js';
import { AnonymousIdentity } from '@dfinity/agent';
import type { ProposalId } from '@dfinity/nns';
import { Principal } from '@dfinity/principal';
import { SnsGovernanceCanister, type SnsManageNeuron, type SnsNeuronId } from '@dfinity/sns';
import type { ListProposalsResponse, ProposalData } from '@dfinity/sns/dist/candid/sns_governance';
import { fromNullable, hexStringToUint8Array, nonNullish } from '@dfinity/utils';
import { unsafeIdentity } from '@junobuild/core-peer';

export const listSnsProposals = async ({
	governanceCanisterId,
	beforeProposal
}: {
	beforeProposal: ProposalId | undefined;
	governanceCanisterId: GovernanceId;
}): Promise<ListProposalsResponse> => {
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
}): Promise<ProposalData | undefined> => {
	const agent = await getAgent({ identity: new AnonymousIdentity() });

	const { getProposal } = SnsGovernanceCanister.create({
		agent,
		canisterId: Principal.fromText(governanceCanisterId)
	});

	return getProposal({ proposalId: { id: proposalId }, certified: false });
};

export const makeProposal = async ({
	url,
	summary,
	title,
	motionText,
	neuronId,
	governanceId
}: Omit<MotionProposalParams, 'governance'> & { governanceId: GovernanceId }): Promise<
	ProposalId | undefined
> => {
	const agent = await getAgent({ identity: await unsafeIdentity() });

	const { manageNeuron } = SnsGovernanceCanister.create({
		agent,
		canisterId: Principal.fromText(governanceId)
	});

	const toManageNeuronCommand = ({
		neuronId: { id },
		command
	}: {
		neuronId: SnsNeuronId;
		command: { MakeProposal: SnsProposal };
	}): SnsManageNeuron => ({
		subaccount: id,
		command: [command]
	});

	const toMakeProposalRequest = (): SnsManageNeuron =>
		toManageNeuronCommand({
			neuronId: { id: hexStringToUint8Array(neuronId) },
			command: {
				MakeProposal: {
					url,
					summary,
					title,
					action: [
						{
							Motion: {
								motion_text: motionText
							}
						}
					]
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
