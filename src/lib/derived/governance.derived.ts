import { GOVERNANCE_CANISTER_ID } from '$lib/constants/app.constants';
import { routeGovernanceId } from '$lib/derived/nav.derived';
import { snsIdStore, sortedSnsesStore } from '$lib/derived/sns.derived';
import type {
	Governance,
	GovernanceId,
	GovernanceType,
	OptionGovernanceId
} from '$lib/types/governance';
import type { CachedSnsDto } from '$lib/types/sns-aggregator';
import { findGovernance } from '$lib/utils/governance.utils';
import { nonNullish } from '@dfinity/utils';
import { derived, type Readable } from 'svelte/store';

export const governanceIdStore: Readable<OptionGovernanceId> = derived(
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
	[routeGovernanceId, governanceSnsesStore],
	([$routeGovernanceId, $governanceSnsesStore]) =>
		findGovernance({
			governanceId: $routeGovernanceId,
			governanceSnses: $governanceSnsesStore
		})
);

export const snsStore: Readable<CachedSnsDto | undefined> = derived(
	[governanceStore, governanceSnsesStore],
	([$governanceStore, $governanceSnsesStore]) =>
		nonNullish($governanceStore?.id) && $governanceStore?.type === 'sns'
			? $governanceSnsesStore[$governanceStore.id]
			: undefined
);
