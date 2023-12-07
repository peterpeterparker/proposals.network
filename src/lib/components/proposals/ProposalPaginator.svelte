<script lang="ts">
	import { nonNullish } from '@dfinity/utils';
	import { last } from '$lib/utils/utils';
	import { proposalsICPStore } from '$lib/derived/proposals.derived';
	import { loadProposals } from '$lib/services/loader-stores.services';
	import type { ProposalId } from '@dfinity/nns';
	import Paginator from '$lib/components/ui/Paginator.svelte';

	let previousBeforeProposal: ProposalId | undefined;
	let beforeProposal: ProposalId | undefined;

	const search = async () => await loadProposals({ beforeProposal });

	const prev = async () => {
		beforeProposal = previousBeforeProposal;
		previousBeforeProposal = undefined;

		await search();
	};

	const next = async () => {
		previousBeforeProposal = beforeProposal;
		beforeProposal = last($proposalsICPStore ?? [])?.id;

		await search();
	};

	let displayPrev: boolean;
	$: displayPrev = nonNullish(beforeProposal);

	let displayNext: boolean;
	$: displayNext = nonNullish($proposalsICPStore) && last($proposalsICPStore)?.id !== 1n;
</script>

{#if nonNullish($proposalsICPStore)}
	<Paginator {displayPrev} {displayNext} on:pnwrkPrevious={prev} on:pnwrkNext={next} />
{/if}
