<script lang="ts">
	import { userGovernanceProposalsStore } from '$lib/derived/user-proposals.derived';
	import { nonNullish } from '@dfinity/utils';
	import { loadUserProposals } from '$lib/services/loader-stores.services';
	import { last } from '$lib/utils/utils';
	import Paginator from '$lib/components/ui/Paginator.svelte';
	import { governanceIdStore } from '$lib/derived/governance.derived';

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
		startAfter = last($userGovernanceProposalsStore?.items ?? [])?.key;

		await search();
	};

	let displayPrev: boolean;
	$: displayPrev = ($userGovernanceProposalsStore?.items_page ?? 0n) > 0n;

	let displayNext: boolean;
	$: displayNext =
		nonNullish($userGovernanceProposalsStore) &&
		($userGovernanceProposalsStore.matches_pages ?? 0n) >
			($userGovernanceProposalsStore.items_page ?? 0n) + 1n;
</script>

{#if nonNullish($userGovernanceProposalsStore)}
	<Paginator {displayPrev} {displayNext} on:pnwrkPrevious={prev} on:pnwrkNext={next} />
{/if}
