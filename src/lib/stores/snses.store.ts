import snses from '$lib/data/snses.json';
import type { CachedSnsDto } from '$lib/types/sns-aggregator';
import { readonly, writable, type Readable } from 'svelte/store';

const snesListStore = writable<CachedSnsDto[]>(snses);
export const snsesStore: Readable<CachedSnsDto[]> = readonly(snesListStore);
