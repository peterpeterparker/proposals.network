<script lang="ts">
	import SubmitContinue from '$lib/components/submit/SubmitContinue.svelte';
	import { createEventDispatcher, getContext } from 'svelte';
	import SubmitMotion from '$lib/components/submit/SubmitMotion.svelte';
	import SubmitAddNodeProvider from '$lib/components/submit/SubmitAddNodeProvider.svelte';
	import { METADATA_CONTEXT_KEY, type MetadataContext } from '$lib/types/metadata.context';

	const { store }: MetadataContext = getContext<MetadataContext>(METADATA_CONTEXT_KEY);

	const dispatch = createEventDispatcher();
	const next = () => dispatch('pnwrkNext');
</script>

{#if $store?.metadata?.proposalAction === 'AddOrRemoveNodeProvider'}
	<SubmitAddNodeProvider />
{:else}
	<SubmitMotion />
{/if}

<SubmitContinue on:click={next} />
