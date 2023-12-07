<script lang="ts">
	import HtmlMarkdown from '$lib/components/ui/HtmlMarkdown.svelte';
	import { PROPOSAL_CONTEXT_KEY, type ProposalContext } from '$lib/types/proposal.context';
	import type { ProposalInfo } from '@dfinity/nns';
	import { getContext, onMount } from 'svelte';
	import type { Option, Proposal } from '@dfinity/nns';
	import { nonNullish } from '@dfinity/utils';
	import { fade } from 'svelte/transition';
	import { routeProposalId } from '$lib/derived/nav.derived';
	import { afterNavigate, beforeNavigate } from '$app/navigation';

	const { store }: ProposalContext<ProposalInfo> =
		getContext<ProposalContext<ProposalInfo>>(PROPOSAL_CONTEXT_KEY);

	let proposal: Option<Proposal>;
	$: proposal = $store?.proposal?.proposal;

	let summary: string | undefined;
	$: summary = proposal?.summary;

	// Reload html/markdown on navigation
	let navigating = false;
	beforeNavigate(() => (navigating = true));

	let cmp: HtmlMarkdown;
	$: navigating,
		(async () => {
			if (!navigating) {
				return;
			}

			navigating = false;

			await cmp?.load();
		})();
</script>

{#if nonNullish(summary)}
	<div in:fade class="col-span-2">
		<HtmlMarkdown content={summary} bind:this={cmp} />
	</div>
{/if}
