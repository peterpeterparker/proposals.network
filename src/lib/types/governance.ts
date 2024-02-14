import type { GovernanceCanisterId } from '$lib/types/core';
import type { ProposalInfo, Proposal as ProposalNns, Tally } from '@dfinity/nns';
import type { SnsTally } from '@dfinity/sns';
import type { Token } from '@dfinity/utils';

export type GovernanceId = GovernanceCanisterId;
export type OptionGovernanceId = GovernanceCanisterId | undefined | null;

export type GovernanceType = 'icp' | 'sns';

export interface Governance {
	id: GovernanceId;
	name: string;
	logo: string;
	type: GovernanceType;
	token?: Token;
}

export type Text = string;

export type ProposalTally = Tally | SnsTally;

export interface Proposer {
	id: string | bigint | undefined;
	url?: string;
}

export interface Action {
	key: string | undefined;
	data: unknown;
}

export type Proposal = Pick<
	ProposalInfo,
	| 'id'
	| 'deadlineTimestampSeconds'
	| 'proposalTimestampSeconds'
	| 'decidedTimestampSeconds'
	| 'executedTimestampSeconds'
	| 'failedTimestampSeconds'
> &
	Partial<Pick<ProposalNns, 'title' | 'summary' | 'url'>> & {
		type: Text | undefined;
		typeDescription: Text | undefined;
		topic?: Text;
		status: Text;
		rewardStatus: Text;
		latestTally?: ProposalTally;
		proposer?: Proposer;
		action?: Action;
	};

// These types correspond with IC Proposal Documentation (https://wiki.internetcomputer.org/wiki/Network_Nervous_System#Proposals)
export type ProposalAction = 'Motion' | 'AddOrRemoveNodeProvider';