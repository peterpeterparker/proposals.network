<script lang="ts">
	import type { Option, Proposal } from '@dfinity/nns';
	import { PROPOSAL_CONTEXT_KEY, type ProposalContext } from '$lib/types/proposal.context';
	import type { ProposalInfo } from '@dfinity/nns';
	import { getContext } from 'svelte';
	import type { ProposalId } from '@dfinity/nns';
	import { nonNullish } from '@dfinity/utils';

	const { store }: ProposalContext<ProposalInfo> =
		getContext<ProposalContext<ProposalInfo>>(PROPOSAL_CONTEXT_KEY);

	let id: Option<ProposalId>;
	let proposal: Option<Proposal>;

	$: id = $store?.proposal?.id;
	$: proposal = $store?.proposal?.proposal;

	let title: string | undefined;
	$: title = proposal?.title;
</script>

<h1 class="font-bold capitalize mb-12 text-6xl">
	Proposal <span class="text-4xl">{nonNullish(id) ? ` #${id}` : ''}</span>
</h1>

{#if nonNullish(title)}
	<h2 class="text-2xl mb-12">{title}</h2>
{/if}
