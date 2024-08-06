import type { Governance } from '$lib/types/governance';
import type {
	CreateServiceNervousSystem,
	MakeProposalRequest,
	Motion,
	NodeProvider
} from '@dfinity/nns';
import type { TransferSnsTreasuryFunds } from '@dfinity/sns/dist/candid/sns_governance';

export type ProposalParams = Omit<MakeProposalRequest, 'action' | 'title' | 'neuronId'> & {
	neuronId: string;
	title: string;
	governance: Governance | undefined;
};
export type MotionProposalParams = ProposalParams & Motion;

export type AddNodeProviderProposalParams = ProposalParams & NodeProvider;

export type CreateServiceNervousSystemParams = ProposalParams & {
	createSns: CreateServiceNervousSystem;
};

export type TransferTreasuryFundsParams = ProposalParams & {
	transferFunds: TransferSnsTreasuryFunds;
};
