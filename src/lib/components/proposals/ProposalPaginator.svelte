<script lang="ts">
	import { userProposalsICPStore } from '$lib/derived/user-proposals.derived';
	import { nonNullish } from '@dfinity/utils';
	import IconNavigateNext from '$lib/components/icons/IconNavigateNext.svelte';
	import ButtonIcon from '$lib/components/ui/ButtonIcon.svelte';
	import { last } from '$lib/utils/utils';
	import { proposalsICPStore } from '$lib/derived/proposals.derived';
	import { loadProposals } from '$lib/services/loader-stores.services';

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
	<nav class="w-full flex justify-center p-4">
		<ButtonIcon disabled={!displayPrev} on:click={prev} ariaLabel="Previous page of data"
			><IconNavigateNext navigate="previous" /></ButtonIcon
		>
		<ButtonIcon disabled={!displayNext} on:click={next} ariaLabel="Next page of data"
			><IconNavigateNext /></ButtonIcon
		>
	</nav>
{/if}
