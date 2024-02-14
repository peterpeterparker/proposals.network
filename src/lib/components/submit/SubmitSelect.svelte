<script lang="ts">
    import ExternalLink from '$lib/components/ui/ExternalLink.svelte';
    import ProposalSelector from '$lib/components/proposals/ProposalSelector.svelte';
	import SubmitContinue from '$lib/components/submit/SubmitContinue.svelte';
    import { createEventDispatcher} from 'svelte';
    import type { ProposalAction } from '$lib/types/governance';

    export let proposalAction: ProposalAction | undefined;
    
    const dispatch = createEventDispatcher();
    const next = () => dispatch('pnwrkNext');
</script>

<h1 class="mb-12 text-4xl font-bold capitalize md:text-6xl">Select Proposal Action</h1>

<style>
    .flex-container {
      display: flex;
      gap: 1rem; 
    }
</style>

<div class="mb-4 flex-container">
    <ProposalSelector bind:proposalAction={proposalAction} />
    <SubmitContinue on:click={next} />
</div>
  

<p class="mb-4 leading-relaxed">
	For detailed information about different proposal types and topics, see the <ExternalLink href="https://internetcomputer.org/docs/current/tokenomics/nns/nns-intro#topics">documentation</ExternalLink>
</p>