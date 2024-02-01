<script lang="ts">
    import SubmitContinue from '$lib/components/submit/SubmitContinue.svelte';
    import { createEventDispatcher} from 'svelte';
	import SubmitMotion from '$lib/components/submit/SubmitMotion.svelte';
	import SubmitAddNodeProvider from '$lib/components/submit/SubmitAddNodeProvider.svelte';

    export let proposalType: string | undefined;

    console.log("Proposal Type: " + proposalType);

    const dispatch = createEventDispatcher();
    const next = () => dispatch('pnwrkNext');

    $: console.log(proposalType);
</script>

{#if proposalType === 'option1'}
    <SubmitMotion />
{:else if proposalType === 'option2'}
    <SubmitAddNodeProvider />
{/if}

<SubmitContinue on:click={next} />

