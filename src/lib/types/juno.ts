import type { GovernanceCanisterId, Markdown } from '$lib/types/core';
import type { ProposalAction } from '$lib/types/governance';
import type { Doc } from '@junobuild/core-peer';

export type ProposalContent = Markdown;
export type ProposalKey = string;
export type ProposalDescription = GovernanceCanisterId;

export interface ProposalNodeProviderEditableMetadata {
	nodeProviderName?: string;
	urlSelfDeclaration?: string;
	urlIdentityProof?: string;
	hashSelfDeclaration?: string;
	hashIdentityProof?: string;
	nodeProviderId?: string;
}

export interface ProposalMotionEditableMetadata {
	title?: string;
	motionText?: string;
	summary?: string;
}

export type ProposalEditableMetadata = {
	url?: string;
	proposalAction?: ProposalAction;
} & ProposalMotionEditableMetadata &
	ProposalNodeProviderEditableMetadata;

export type ProposalMetadata = {
	status: 'draft' | 'submitted';
	proposalId?: bigint;
} & ProposalEditableMetadata;

export type ProposalMetadataDoc = Doc<ProposalMetadata>;

export type Neuron = Record<GovernanceCanisterId, (string | bigint)[]>;
