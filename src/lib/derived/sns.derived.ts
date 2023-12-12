import { governanceSnsIdStore } from '$lib/derived/governance.derived';
import { snsesStore } from '$lib/stores/snses.store';
import { derived, type Readable } from 'svelte/store';

export const rootIdStore: Readable<string | undefined | null> = derived(
	[governanceSnsIdStore, snsesStore],
	([$governanceSnsIdStore, $snsesStore]) =>
		$snsesStore.find(
			({ canister_ids: { governance_canister_id } }) =>
				governance_canister_id === $governanceSnsIdStore
		)?.canister_ids.root_canister_id
);
