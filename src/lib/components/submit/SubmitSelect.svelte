<script lang="ts">
	import ExternalLink from '$lib/components/ui/ExternalLink.svelte';
	import SubmitProposalAction from '$lib/components/submit/SubmitProposalAction.svelte';
	import { createEventDispatcher, getContext } from 'svelte';
	import { isNullish } from '@dfinity/utils';
	import Button from '$lib/components/ui/Button.svelte';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import SubmitTitle from '$lib/components/submit/SubmitTitle.svelte';

	const { store }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);

	const dispatch = createEventDispatcher();
	const next = () => dispatch('pnwrkNext');
</script>

<SubmitTitle>What kind of Proposal?</SubmitTitle>

<h2 class="mb-6 text-2xl">
	There are various types of proposals, so the first thing to do is to choose the one you're looking
	to submit.
</h2>

<div class="mb-6">
	<SubmitProposalAction />
</div>

<Button color="tertiary" disabled={isNullish($store?.metadata?.proposalAction)} on:click={next}
	>Continue</Button
>

<p class="leading-relaxed text-sm mt-8 mb-4 italic">
	For detailed information about different proposal types and topics, see the <ExternalLink
		href="https://internetcomputer.org/docs/current/tokenomics/nns/nns-intro#topics"
		>documentation</ExternalLink
	>
</p>
