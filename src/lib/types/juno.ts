import type { Markdown } from '$lib/types/app';
import type { NeuronId } from '@dfinity/nns';
import type { Doc } from '@junobuild/core';

export type ProposalContent = Markdown;
export type ProposalKey = string;
export type ProposalToken = string;

export type Timestamp = number;

export interface ProposalMetadata {
	title: string;
	lastChange: Timestamp | undefined;
	proposalId?: bigint;
}

export type ProposalMetadataDoc = Doc<ProposalMetadata>;

export type Neuron = Record<ProposalToken, NeuronId[]>;
