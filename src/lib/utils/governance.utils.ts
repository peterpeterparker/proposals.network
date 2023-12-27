import { GOVERNANCE_CANISTER_ID } from '$lib/constants/app.constants';
import type { Governance, GovernanceId, OptionGovernanceId } from '$lib/types/governance';
import type { CachedSnsDto } from '$lib/types/sns-aggregator';
import { mapOptionalToken } from '$lib/utils/icrc-tokens.utils';
import { ICPToken, nonNullish } from '@dfinity/utils';

export const findGovernance = ({
	governanceId,
	governanceSnses
}: {
	governanceId: OptionGovernanceId;
	governanceSnses: Record<GovernanceId, CachedSnsDto>;
}): Governance | undefined => {
	if (nonNullish(governanceId) && nonNullish(governanceSnses[governanceId])) {
		const {
			meta: { name },
			icrc1_metadata
		} = governanceSnses[governanceId];

		return {
			id: governanceId,
			name: name ?? '',
			type: 'sns' as const,
			logo: `logo/snses/${governanceId}.png`,
			token: mapOptionalToken(icrc1_metadata)
		};
	}

	if (nonNullish(GOVERNANCE_CANISTER_ID) && governanceId === GOVERNANCE_CANISTER_ID) {
		return {
			id: GOVERNANCE_CANISTER_ID,
			name: 'Internet Computer',
			type: 'icp' as const,
			logo: 'logo/icp.svg',
			token: ICPToken
		};
	}

	return undefined;
};
