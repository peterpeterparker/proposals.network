import type { SnsGovernanceDid } from '@icp-sdk/canisters/sns';

export interface SnsProposal {
	url: string;
	title: string;
	action: [] | [SnsGovernanceDid.Action];
	summary: string;
}

export type IcrcAccountText = string;
