import type { GovernanceCanisterId, Markdown } from '$lib/types/core';
import type { ProposalAction } from '$lib/types/governance';
import type { Doc } from '@junobuild/core-peer';

export type ProposalContent = Markdown;
export type ProposalKey = string;
export type ProposalDescription = GovernanceCanisterId;

export interface ProposalEditableMetadata {
	title?: string;
	url?: string;
	motionText?: string;
	summary?: string;
	nodeProviderName: string;
	urlSelfDeclaration: string;
	urlIdentityProof: string;
	hashSelfDeclaration: string;
	hashIdentityProof: string;
	nodeProviderId?: string;
	proposalAction?: ProposalAction;
}

export type ProposalMetadata = {
	status: 'draft' | 'submitted';
	proposalId?: bigint;
} & ProposalEditableMetadata;

export type ProposalMetadataDoc = Doc<ProposalMetadata>;

export type Neuron = Record<GovernanceCanisterId, (string | bigint)[]>;
