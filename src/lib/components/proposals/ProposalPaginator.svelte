<script lang="ts">
	import { nonNullish } from '@dfinity/utils';
	import { last } from '$lib/utils/utils';
	import { selectedProposalsStore } from '$lib/derived/proposals.derived';
	import { loadProposals } from '$lib/services/loader-stores.services';
	import type { ProposalId } from '@icp-sdk/canisters/nns';
	import Paginator from '$lib/components/ui/Paginator.svelte';
	import { governanceIdStore, governanceTypeStore } from '$lib/derived/governance.derived';

	let previousBeforeProposal: ProposalId | undefined;
	let beforeProposal: ProposalId | undefined;

	const search = async () =>
		await loadProposals({
			beforeProposal,
			governanceCanisterId: $governanceIdStore,
			type: $governanceTypeStore
		});

	const prev = async () => {
		beforeProposal = previousBeforeProposal;
		previousBeforeProposal = undefined;

		await search();
	};

	const next = async () => {
		previousBeforeProposal = beforeProposal;
		beforeProposal = last($selectedProposalsStore ?? [])?.id;

		await search();
	};

	let displayPrev: boolean;
	$: displayPrev = nonNullish(beforeProposal);

	let displayNext: boolean;
	$: displayNext = nonNullish($selectedProposalsStore) && last($selectedProposalsStore)?.id !== 1n;
</script>

{#if nonNullish($selectedProposalsStore)}
	<Paginator {displayPrev} {displayNext} on:pnwrkPrevious={prev} on:pnwrkNext={next} />
{/if}
