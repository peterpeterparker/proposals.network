import { GOVERNANCE_CANISTER_ID } from '$lib/constants/app.constants';
import { routeGovernanceId } from '$lib/derived/nav.derived';
import { snsesStore } from '$lib/stores/snses.store';
import { nonNullish } from '@dfinity/utils';
import { derived, type Readable } from 'svelte/store';

export const governanceSnsIdStore: Readable<string | undefined> = derived(
	[routeGovernanceId, snsesStore],
	([$routeGovernanceId, $snsesStore]) =>
		nonNullish($routeGovernanceId) &&
		$snsesStore.some(
			({ canister_ids: { governance_canister_id } }) =>
				governance_canister_id === $routeGovernanceId
		)
			? $routeGovernanceId
			: undefined
);

export const governanceIdStore: Readable<string | undefined | null> = derived(
	[governanceSnsIdStore],
	([$governanceSnsIdStore]) =>
		nonNullish($governanceSnsIdStore) ? $governanceSnsIdStore : GOVERNANCE_CANISTER_ID
);

export const governanceTypeStore: Readable<'icp' | 'sns'> = derived(
	[governanceSnsIdStore],
	([$governanceSnsIdStore]) => (nonNullish($governanceSnsIdStore) ? 'sns' : 'icp')
);
