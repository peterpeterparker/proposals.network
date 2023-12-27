import type { SnsAction } from '@dfinity/sns';

export interface SnsProposal {
	url: string;
	title: string;
	action: [] | [SnsAction];
	summary: string;
}
