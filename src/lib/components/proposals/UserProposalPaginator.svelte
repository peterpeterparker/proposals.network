<script lang="ts">
	import { nonNullish } from '@dfinity/utils';
	import { loadUserProposals } from '$lib/services/loader-stores.services';
	import { last } from '$lib/utils/utils';
	import Paginator from '$lib/components/ui/Paginator.svelte';
	import { governanceIdStore } from '$lib/derived/governance.derived';
	import { userProposalsStore } from '$lib/stores/user-proposals.store';
	import { USER_PAGINATION } from '$lib/constants/app.constants';

	let previousStartAfter: string | undefined;
	let startAfter: string | undefined;

	const search = async () =>
		await loadUserProposals({ startAfter, governanceId: $governanceIdStore });

	const prev = async () => {
		startAfter = previousStartAfter;
		previousStartAfter = undefined;

		await search();
	};

	const next = async () => {
		previousStartAfter = startAfter;
		startAfter = last($userProposalsStore?.items ?? [])?.key;

		await search();
	};

	let displayPrev: boolean;
	$: displayPrev = ($userProposalsStore?.items_page ?? 0n) > 0n;

	let displayNext: boolean;
	$: displayNext =
		nonNullish($userProposalsStore) &&
		($userProposalsStore.matches_length ?? 0n) >
			($userProposalsStore.items_page ?? 0n) * BigInt(USER_PAGINATION) +
				$userProposalsStore.items_length;
</script>

{#if nonNullish($userProposalsStore)}
	<Paginator {displayPrev} {displayNext} on:pnwrkPrevious={prev} on:pnwrkNext={next} />
{/if}
