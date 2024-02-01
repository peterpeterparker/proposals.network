<script lang="ts">
    import SubmitContinue from '$lib/components/submit/SubmitContinue.svelte';
    import { createEventDispatcher} from 'svelte';
	import SubmitMotion from '$lib/components/submit/SubmitMotion.svelte';

    export let proposalType: string | undefined;

    console.log("Proposal Type: " + proposalType);

    const dispatch = createEventDispatcher();
    const next = () => dispatch('pnwrkNext');

    $: console.log(proposalType);
</script>

<h1 class="mb-12 text-4xl font-bold capitalize md:text-6xl">Craft Your Proposal</h1>

<SubmitMotion />

<SubmitContinue on:click={next} />

