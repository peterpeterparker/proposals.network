<script lang="ts">
	import { userProposalsICPStore } from '$lib/derived/user-proposals.derived';
	import { nonNullish } from '@dfinity/utils';
	import { loadUserProposals } from '$lib/services/loader-stores.services';
	import { last } from '$lib/utils/utils';
	import Paginator from '$lib/components/ui/Paginator.svelte';

	let previousStartAfter: string | undefined;
	let startAfter: string | undefined;

	const search = async () => await loadUserProposals({ startAfter });

	const prev = async () => {
		startAfter = previousStartAfter;
		previousStartAfter = undefined;

		await search();
	};

	const next = async () => {
		previousStartAfter = startAfter;
		startAfter = last($userProposalsICPStore?.items ?? [])?.key;

		await search();
	};

	let displayPrev: boolean;
	$: displayPrev = ($userProposalsICPStore?.items_page ?? 0n) > 0n;

	let displayNext: boolean;
	$: displayNext =
		nonNullish($userProposalsICPStore) &&
		($userProposalsICPStore.matches_pages ?? 0n) > ($userProposalsICPStore.items_page ?? 0n) + 1n;
</script>

{#if nonNullish($userProposalsICPStore)}
	<Paginator {displayPrev} {displayNext} on:pnwrkPrevious={prev} on:pnwrkNext={next} />
{/if}
