import { routeGovernanceId } from '$lib/derived/nav.derived';
import { snsesStore } from '$lib/stores/snses.store';
import type { GovernanceId } from '$lib/types/governance';
import type { CachedSnsDto } from '$lib/types/sns-aggregator';
import { convertNervousFunction } from '$lib/utils/sns-proposals.utils';
import type { SnsNervousSystemFunction } from '@dfinity/sns';
import { nonNullish } from '@dfinity/utils';
import { derived, type Readable } from 'svelte/store';

export const sortedSnsesStore: Readable<CachedSnsDto[]> = derived(snsesStore, ($snsesStore) =>
	$snsesStore.sort(({ meta: { name: nameA } }, { meta: { name: nameB } }) =>
		(nameA ?? '').localeCompare(nameB ?? '')
	)
);

export const snsIdStore: Readable<GovernanceId | undefined> = derived(
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

export const snsNsFunctionsStore: Readable<SnsNervousSystemFunction[] | undefined> = derived(
	[snsIdStore, snsesStore],
	([$snsIdStore, $snsesStore]) => {
		const aggregatorProject: CachedSnsDto | undefined = $snsesStore.find(
			({ canister_ids: { governance_canister_id } }) => governance_canister_id === $snsIdStore
		);

		return aggregatorProject?.parameters.functions.map(convertNervousFunction);
	}
);

export const rootCanisterIdStore: Readable<string | undefined | null> = derived(
	[snsIdStore, snsesStore],
	([$snsIdStore, $snsesStore]) =>
		$snsesStore.find(
			({ canister_ids: { governance_canister_id } }) => governance_canister_id === $snsIdStore
		)?.canister_ids.root_canister_id
);
