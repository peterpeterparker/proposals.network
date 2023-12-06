<script lang="ts">
	import HtmlMarkdown from '$lib/components/ui/HtmlMarkdown.svelte';
	import { PROPOSAL_CONTEXT_KEY, type ProposalContext } from '$lib/types/proposal.context';
	import type { ProposalInfo } from '@dfinity/nns';
	import { getContext } from 'svelte';
	import type { Option, Proposal } from '@dfinity/nns';
	import { nonNullish } from '@dfinity/utils';
	import { fade } from 'svelte/transition';

	const { store }: ProposalContext<ProposalInfo> =
		getContext<ProposalContext<ProposalInfo>>(PROPOSAL_CONTEXT_KEY);

	let proposal: Option<Proposal>;
	$: proposal = $store?.proposal?.proposal;

	let summary: string | undefined;
	$: summary = proposal?.summary;
</script>

{#if nonNullish(summary)}
	<div in:fade class="col-span-2">
		<HtmlMarkdown content={summary} />
	</div>
{/if}
