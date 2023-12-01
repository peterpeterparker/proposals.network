import type { JSONContent } from '@tiptap/core';
import type {Doc} from "@junobuild/core";

export type ProposalContent = JSONContent;
export type ProposalKey = string;
export type ProposalToken = string;

export type Timestamp = number;

export interface ProposalMetadata {
    title: string;
    lastChange: Timestamp | undefined;
    proposalId?: bigint;
}

export type ProposalMetadataDoc = Doc<ProposalMetadata>;