import { snsesStore } from '$lib/stores/snses.store';
import type { CachedSnsDto } from '$lib/types/sns-aggregator';
import { derived, type Readable } from 'svelte/store';

export const sortedSnsesStore: Readable<CachedSnsDto[]> = derived(snsesStore, ($snsesStore) =>
	$snsesStore.sort(({ meta: { name: nameA } }, { meta: { name: nameB } }) =>
		(nameA ?? '').localeCompare(nameB ?? '')
	)
);
