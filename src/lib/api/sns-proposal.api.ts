import { getAgent } from '$lib/api/agent.api';
import { NETWORK_PAGINATION } from '$lib/constants/app.constants';
import type { GovernanceId } from '$lib/types/governance';
import { AnonymousIdentity } from '@dfinity/agent';
import type { ProposalId } from '@dfinity/nns';
import { Principal } from '@dfinity/principal';
import { SnsGovernanceCanister } from '@dfinity/sns';
import type { ProposalData } from '@dfinity/sns/dist/candid/sns_governance';
import { nonNullish } from '@dfinity/utils';

export const listSnsProposals = async ({
	governanceCanisterId,
	beforeProposal
}: {
	beforeProposal: ProposalId | undefined;
	governanceCanisterId: GovernanceId;
}): Promise<ProposalData[]> => {
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
