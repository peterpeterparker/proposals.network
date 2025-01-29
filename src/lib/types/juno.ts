import type { GovernanceCanisterId, Markdown } from '$lib/types/core';
import type { ProposalAction } from '$lib/types/governance';
import type { IcrcAccountText } from '$lib/types/ic-js';
import type { Asset, Doc } from '@junobuild/core';

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

export interface ProposalSnsTreasuryFundsEditableMetadata {
	destinationAddress?: IcrcAccountText;
	amount?: bigint;
}

export type ProposalEditableMetadata = {
	url?: string;
	proposalAction?: ProposalAction;
} & ProposalMotionEditableMetadata &
	ProposalNodeProviderEditableMetadata &
	ProposalSnsTreasuryFundsEditableMetadata;

export type ProposalMetadataStatus = 'draft' | 'submitted';

export type ProposalMetadata = {
	status: ProposalMetadataStatus;
	proposalId?: bigint;
} & ProposalEditableMetadata;

export type ProposalMetadataDoc = Doc<ProposalMetadata>;

export type Neuron = Record<GovernanceCanisterId, (string | bigint)[]>;

export type StorageSnsYamlCollection = 'sns-parameters';
export type StorageSnsPngCollection = 'sns-logo';
export type StorageSnsCollections = StorageSnsYamlCollection | StorageSnsPngCollection;

export type ProposalAsset = Pick<Asset, 'fullPath' | 'token'> & {
	file: Blob;
};
