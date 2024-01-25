<script>
    import ExternalLink from '$lib/components/ui/ExternalLink.svelte';
    import ProposalSelector from '$lib/components/proposals/ProposalSelector.svelte';
	import SubmitContinue from '$lib/components/submit/SubmitContinue.svelte';
	import { createEventDispatcher, onMount } from 'svelte';

    const dispatch = createEventDispatcher();
	const next = () => dispatch('pnwrkNext');
</script>

<h1 class="mb-12 text-6xl font-bold capitalize">Select Proposal Type</h1>

<style>
    .flex-container {
      display: flex;
      gap: 1rem; 
    }
</style>
  
<div class="flex-container">
    <div class="mb-4">
        <ProposalSelector />
    </div>
  
    <div class="mb-4">
        <!-- <Button color="secondary" type="submit">Save and continue</Button> -->
        <SubmitContinue on:click={next} />
    </div>
</div>
  

<p class="mb-4 leading-relaxed">
	For detailed information about different proposal types and topics, see the <ExternalLink href="https://internetcomputer.org/docs/current/tokenomics/nns/nns-intro#topics">documentation</ExternalLink>
</p>