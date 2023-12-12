import { governanceIdStore } from '$lib/derived/governance.derived';
import { proposalsStore } from '$lib/stores/proposals.store';
import type { Proposal } from '$lib/types/governance';
import { isNullish } from '@dfinity/utils';
import { derived, type Readable } from 'svelte/store';

export const selectedProposalsStore: Readable<Proposal[] | undefined | null> = derived(
	[proposalsStore, governanceIdStore],
	([$proposalsStore, $governanceIdStore]) => {
		if (isNullish($proposalsStore)) {
			return $proposalsStore;
		}

		if (isNullish($governanceIdStore)) {
			return undefined;
		}

		return $proposalsStore[$governanceIdStore];
	}
);
