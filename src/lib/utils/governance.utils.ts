import { GOVERNANCE_CANISTER_ID } from '$lib/constants/app.constants';
import { NNS_GOVERNANCE_METADATA } from '$lib/constants/governance.constants';
import type { Governance, GovernanceId, OptionGovernanceId } from '$lib/types/governance';
import type { CachedSnsDto } from '$lib/types/sns-aggregator';
import { mapOptionalToken } from '$lib/utils/icrc-tokens.utils';
import { nonNullish } from '@dfinity/utils';

export const findGovernance = ({
	governanceId,
	governanceSnses
}: {
	governanceId: OptionGovernanceId;
	governanceSnses: Record<GovernanceId, CachedSnsDto>;
}): Governance | undefined => {
	if (nonNullish(governanceId) && nonNullish(governanceSnses[governanceId])) {
		const sns = governanceSnses[governanceId];
		return mapSnsGovernance({ governanceId, sns });
	}

	if (nonNullish(GOVERNANCE_CANISTER_ID) && governanceId === GOVERNANCE_CANISTER_ID) {
		return {
			id: GOVERNANCE_CANISTER_ID,
			...NNS_GOVERNANCE_METADATA
		};
	}

	return undefined;
};

export const mapSnsGovernance = ({
	governanceId,
	sns: {
		meta: { name },
		icrc1_metadata
	}
}: {
	governanceId: GovernanceId;
	sns: CachedSnsDto;
}) => ({
	id: governanceId,
	name: name ?? '',
	type: 'sns' as const,
	logo: `logo/snses/${governanceId}.png`,
	token: mapOptionalToken(icrc1_metadata)
});
