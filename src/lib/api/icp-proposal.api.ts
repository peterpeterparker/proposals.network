import { getAgent } from '$lib/api/agent.api';
import { GOVERNANCE_CANISTER_ID, NETWORK_PAGINATION } from '$lib/constants/app.constants';
import type { MotionProposalParams } from '$lib/services/proposal.services';
import { enumsExclude } from '$lib/utils/enum.utils';
import { AnonymousIdentity } from '@dfinity/agent';
import type { ListProposalsResponse, ProposalInfo } from '@dfinity/nns';
import {
	GovernanceCanister,
	ProposalRewardStatus,
	ProposalStatus,
	Topic,
	type MakeProposalRequest,
	type ProposalId
} from '@dfinity/nns';
import { Principal } from '@dfinity/principal';
import { assertNonNullish } from '@dfinity/utils';
import { unsafeIdentity } from '@junobuild/core-peer';

export const listIcpProposals = async (
	beforeProposal: ProposalId | undefined
): Promise<ListProposalsResponse> => {
	assertNonNullish(GOVERNANCE_CANISTER_ID, 'The ICP governance canister ID is not set.');

	const agent = await getAgent({ identity: new AnonymousIdentity() });

	const { listProposals } = GovernanceCanister.create({
		agent,
		canisterId: Principal.fromText(GOVERNANCE_CANISTER_ID)
	});

	return listProposals({
		request: {
			limit: NETWORK_PAGINATION,
			beforeProposal,
			excludeTopic: [Topic.Unspecified],
			includeRewardStatus: enumsExclude({
				obj: ProposalRewardStatus as unknown as ProposalRewardStatus,
				values: [ProposalRewardStatus.Unknown]
			}),
			includeStatus: enumsExclude({
				obj: ProposalStatus as unknown as ProposalStatus,
				values: [ProposalStatus.Unknown]
			}),
			includeAllManageNeuronProposals: false
		},
		certified: false
	});
};

export const getProposal = async ({
	proposalId
}: {
	proposalId: ProposalId;
}): Promise<ProposalInfo | undefined> => {
	assertNonNullish(GOVERNANCE_CANISTER_ID, 'The ICP governance canister ID is not set.');

	const agent = await getAgent({ identity: new AnonymousIdentity() });

	const { getProposal } = GovernanceCanister.create({
		agent,
		canisterId: Principal.fromText(GOVERNANCE_CANISTER_ID)
	});

	return getProposal({ proposalId, certified: false });
};

export const makeProposal = async (
	params: MotionProposalParams
): Promise<ProposalId | undefined> => {
	assertNonNullish(GOVERNANCE_CANISTER_ID, 'The ICP governance canister ID is not set.');

	const agent = await getAgent({ identity: await unsafeIdentity() });

	const { makeProposal } = GovernanceCanister.create({
		agent,
		canisterId: Principal.fromText(GOVERNANCE_CANISTER_ID)
	});

	const request = makeMotionProposalRequest(params);
	return makeProposal(request);
};

const makeMotionProposalRequest = ({
	motionText,
	...rest
}: MotionProposalParams): MakeProposalRequest => ({
	action: {
		Motion: {
			motionText
		}
	},
	...rest
});
