import { busy, wizardBusy } from '$lib/stores/busy.store';
import { nonNullish } from '@dfinity/utils';
import { derived, type Readable } from 'svelte/store';

export const isBusy: Readable<boolean> = derived(
    [busy, wizardBusy],
    ([$busy, $wizardBusy]) => nonNullish($busy) || $wizardBusy
);
