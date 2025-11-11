import type { SnsAction } from '@icp-sdk/canisters/sns';

export interface SnsProposal {
	url: string;
	title: string;
	action: [] | [SnsAction];
	summary: string;
}

export type IcrcAccountText = string;
