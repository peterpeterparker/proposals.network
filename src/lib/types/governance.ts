import type { ProposalInfo, Proposal as ProposalNns, Tally } from '@dfinity/nns';
import type { SnsTally } from '@dfinity/sns';

export type GovernanceId = string;

export type Text = string;

export type ProposalVote = Tally | SnsTally;

export type Proposal = Pick<ProposalInfo, 'id' | 'deadlineTimestampSeconds'> &
	Pick<ProposalNns, 'title'> & {
		type: Text | undefined;
		typeDescription: Text | undefined;
		topic?: Text;
		status: Text;
		vote?: ProposalVote;
	};
