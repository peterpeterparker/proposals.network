import { getAgent } from '$lib/api/agent.api';
import { GOVERNANCE_CANISTER_ID } from '$lib/constants/app.constants';
import type { MotionProposalParams } from '$lib/services/proposal.services';
import { AnonymousIdentity } from '@dfinity/agent';
import type { ProposalInfo } from '@dfinity/nns';
import { GovernanceCanister, type MakeProposalRequest, type ProposalId } from '@dfinity/nns';
import { Principal } from '@dfinity/principal';
import { assertNonNullish } from '@dfinity/utils';
import { unsafeIdentity } from '@junobuild/core';

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

	return getProposal({ proposalId });
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
