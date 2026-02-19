import type { Governance } from '$lib/types/governance';
import type { SnsGovernanceDid } from '@icp-sdk/canisters/sns';
import type {
	CreateServiceNervousSystem,
	MakeProposalRequest,
	Motion,
	NodeProvider
} from '@icp-sdk/canisters/nns';

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
	transferFunds: SnsGovernanceDid.TransferSnsTreasuryFunds;
};
