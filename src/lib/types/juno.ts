import type { Markdown } from '$lib/types/app';
import type { NeuronId } from '@dfinity/nns';
import type { Doc } from '@junobuild/core';

export type ProposalContent = Markdown;
export type ProposalKey = string;
export type ProposalToken = string;

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

export type Neuron = Record<ProposalToken, NeuronId[]>;
