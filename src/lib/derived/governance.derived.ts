import { GOVERNANCE_CANISTER_ID } from '$lib/constants/app.constants';
import { snsIdStore, sortedSnsesStore } from '$lib/derived/sns.derived';
import type { Governance, GovernanceId, GovernanceType } from '$lib/types/governance';
import type { CachedSnsDto } from '$lib/types/sns-aggregator';
import { nonNullish } from '@dfinity/utils';
import { derived, type Readable } from 'svelte/store';

export const governanceIdStore: Readable<GovernanceId | undefined | null> = derived(
	[snsIdStore],
	([$snsIdStore]) => (nonNullish($snsIdStore) ? $snsIdStore : GOVERNANCE_CANISTER_ID)
);

export const governanceTypeStore: Readable<GovernanceType> = derived(
	[snsIdStore],
	([$snsIdStore]) => (nonNullish($snsIdStore) ? 'sns' : 'icp')
);

export const governanceSnsesStore: Readable<Record<GovernanceId, CachedSnsDto>> = derived(
	sortedSnsesStore,
	($sortedSnsesStore) =>
		$sortedSnsesStore.reduce(
			(acc, sns) => ({
				...acc,
				[sns.canister_ids.governance_canister_id]: sns
			}),
			{}
		)
);

export const governanceStore: Readable<Governance | undefined> = derived(
	[snsIdStore, governanceSnsesStore],
	([$snsIdStore, $governanceSnsesStore]) => {
		if (nonNullish($snsIdStore) && nonNullish($governanceSnsesStore[$snsIdStore])) {
			return {
				id: $snsIdStore,
				name: $governanceSnsesStore[$snsIdStore].meta.name ?? '',
				type: 'sns' as const,
				logo: `logo/snses/${$snsIdStore}.png`
			};
		}

		if (nonNullish(GOVERNANCE_CANISTER_ID)) {
			return {
				id: GOVERNANCE_CANISTER_ID,
				name: 'Internet Computer',
				type: 'icp' as const,
				logo: 'logo/icp.svg'
			};
		}

		return undefined;
	}
);
