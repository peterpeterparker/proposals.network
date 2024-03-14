<script lang="ts">
	import ExternalLink from '$lib/components/ui/ExternalLink.svelte';
	import SubmitProposalAction from '$lib/components/submit/SubmitProposalAction.svelte';
	import SubmitSelectContinue from '$lib/components/submit/SubmitSelectContinue.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	const next = () => dispatch('pnwrkNext');
</script>

<h1 class="mb-12 text-4xl font-bold capitalize md:text-6xl">Select Proposal Action</h1>

<div class="flex flex-row mb-4 gap-x-4">
	<SubmitProposalAction />
	<SubmitSelectContinue on:click={next} />
</div>

<p class="mb-4 leading-relaxed">
	For detailed information about different proposal types and topics, see the <ExternalLink
		href="https://internetcomputer.org/docs/current/tokenomics/nns/nns-intro#topics"
		>documentation</ExternalLink
	>
</p>
