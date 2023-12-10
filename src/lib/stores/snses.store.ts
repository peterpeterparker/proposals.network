import snses from '$lib/data/snses.json';
import type { CachedSnsDto } from '$lib/types/sns-aggregator';
import { readonly, writable } from 'svelte/store';

const snesListStore = writable<CachedSnsDto[]>(snses);
export const snsesStore = readonly(snesListStore);
