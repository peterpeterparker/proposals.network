import type { JSONContent } from '@tiptap/core';

export type ProposalContent = JSONContent;
export type ProposalKey = string;
export type ProposalToken = string;

export type Timestamp = number;

export interface ProposalMetadata {
    title: string;
    lastChange: Timestamp | undefined;
}