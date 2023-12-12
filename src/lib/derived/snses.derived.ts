import { governanceSnsIdStore } from '$lib/derived/governance.derived';
import { snsesStore } from '$lib/stores/snses.store';
import type { CachedSnsDto } from '$lib/types/sns-aggregator';
import { convertNervousFunction } from '$lib/utils/sns-proposals.utils';
import type { SnsNervousSystemFunction } from '@dfinity/sns';
import { derived, type Readable } from 'svelte/store';

export const sortedSnsesStore: Readable<CachedSnsDto[]> = derived(snsesStore, ($snsesStore) =>
	$snsesStore.sort(({ meta: { name: nameA } }, { meta: { name: nameB } }) =>
		(nameA ?? '').localeCompare(nameB ?? '')
	)
);

export const snsNsFunctionsStore: Readable<SnsNervousSystemFunction[] | undefined> = derived(
	[governanceSnsIdStore, snsesStore],
	([$governanceSnsIdStore, $snsesStore]) => {
		const aggregatorProject: CachedSnsDto | undefined = $snsesStore.find(
			({ canister_ids: { governance_canister_id } }) =>
				governance_canister_id === $governanceSnsIdStore
		);

		return aggregatorProject?.parameters.functions.map(convertNervousFunction);
	}
);
