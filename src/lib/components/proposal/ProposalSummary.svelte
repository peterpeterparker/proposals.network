<script lang="ts">
	import HtmlMarkdown from '$lib/components/ui/HtmlMarkdown.svelte';
	import { PROPOSAL_CONTEXT_KEY, type ProposalContext } from '$lib/types/proposal.context';
	import { getContext } from 'svelte';
	import { nonNullish } from '@dfinity/utils';
	import { fade } from 'svelte/transition';

	const { store }: ProposalContext = getContext<ProposalContext>(PROPOSAL_CONTEXT_KEY);

	let summary: string | undefined;
	$: summary = $store?.proposal?.summary;

	let cmp: HtmlMarkdown;
	$: summary, (async () => await cmp?.reload())();
</script>

{#if nonNullish(summary)}
	<div in:fade class="col-span-2">
		<HtmlMarkdown content={summary} bind:this={cmp} />
	</div>
{/if}
