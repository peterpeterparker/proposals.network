import type { Governance } from '$lib/types/governance';
import { ICPToken } from '@dfinity/utils';

export const NNS_GOVERNANCE_METADATA: Omit<Governance, 'id'> = {
	name: 'Internet Computer',
	type: 'icp' as const,
	logo: 'logo/icp.svg',
	token: ICPToken
};
