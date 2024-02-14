<script lang="ts">
    import SubmitContinue from '$lib/components/submit/SubmitContinue.svelte';
    import { createEventDispatcher} from 'svelte';
	import SubmitMotion from '$lib/components/submit/SubmitMotion.svelte';
	import SubmitAddNodeProvider from '$lib/components/submit/SubmitAddNodeProvider.svelte';

    export let proposalAction: string | undefined;

    const dispatch = createEventDispatcher();
    const next = () => dispatch('pnwrkNext');
</script>

{#if proposalAction === 'Motion'}
    <SubmitMotion />
{:else if proposalAction === 'AddOrRemoveNodeProvider'}
    <SubmitAddNodeProvider />
{/if}

<SubmitContinue on:click={next} />

