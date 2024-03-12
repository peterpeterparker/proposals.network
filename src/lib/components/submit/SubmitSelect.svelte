<script lang="ts">
	import ExternalLink from '$lib/components/ui/ExternalLink.svelte';
	import ProposalSelector from '$lib/components/proposals/ProposalSelector.svelte';
	import SubmitSelectContinue from '$lib/components/submit/SubmitSelectContinue.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { ProposalAction } from '$lib/types/governance';
	import { getEditable } from '$lib/services/idb.services';
	import type { ProposalEditableMetadata } from '$lib/types/juno';

	let metadata: ProposalEditableMetadata | undefined;
	export let proposalAction: ProposalAction | undefined;
	
	const dispatch = createEventDispatcher();
	const next = () => dispatch('pnwrkNext');

	onMount(async () => ([metadata] = await getEditable()));
</script>

<h1 class="mb-12 text-4xl font-bold capitalize md:text-6xl">Select Proposal Action</h1>

<div class="flex flex-row mb-4 gap-x-4">
	<ProposalSelector {metadata} bind:proposalAction />
	<SubmitSelectContinue on:click={next} {proposalAction} />
</div>

<p class="mb-4 leading-relaxed">
	For detailed information about different proposal types and topics, see the <ExternalLink
		href="https://internetcomputer.org/docs/current/tokenomics/nns/nns-intro#topics"
		>documentation</ExternalLink
	>
</p>
