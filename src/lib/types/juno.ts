import type { GovernanceCanisterId, Markdown } from '$lib/types/core';
import type { NeuronId } from '@dfinity/nns';
import type { Doc } from '@junobuild/core-peer';

export type ProposalContent = Markdown;
export type ProposalKey = string;

export interface ProposalEditableMetadata {
	title?: string;
	url?: string;
	motionText?: string;
}

export type ProposalMetadata = {
	status: 'draft' | 'submitted';
	proposalId?: bigint;
} & ProposalEditableMetadata;

export type ProposalMetadataDoc = Doc<ProposalMetadata>;

export type Neuron = Record<GovernanceCanisterId, NeuronId[]>;
