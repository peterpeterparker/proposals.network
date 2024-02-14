<script lang="ts">
    import SubmitContinue from '$lib/components/submit/SubmitContinue.svelte';
    import { createEventDispatcher, onMount} from 'svelte';
	import SubmitMotion from '$lib/components/submit/SubmitMotion.svelte';
	import SubmitAddNodeProvider from '$lib/components/submit/SubmitAddNodeProvider.svelte';
    import type { ProposalContent } from '$lib/types/juno';
	import type { ProposalEditableMetadata } from '$lib/types/juno';
	import { getEditable } from '$lib/services/idb.services';

	let metadata: ProposalEditableMetadata | undefined;
	let content: ProposalContent | undefined;
    export let proposalAction: string | undefined;

	onMount(async () => ([metadata, content] = await getEditable()));

	const dispatch = createEventDispatcher();
	const next = () => dispatch('pnwrkNext');
</script>

{#if proposalAction === 'Motion'}
    <SubmitMotion {metadata} {content} />
{:else if proposalAction === 'AddOrRemoveNodeProvider'}
    <SubmitAddNodeProvider />
{/if}

<SubmitContinue on:click={next} />

