import type { ProposalInfo, Proposal as ProposalNns, Tally } from '@dfinity/nns';
import type { SnsTally } from '@dfinity/sns';

export type GovernanceId = string;

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
