<script lang="ts">
	import SubmitContinue from '$lib/components/submit/SubmitContinue.svelte';
	import { createEventDispatcher, getContext } from 'svelte';
	import SubmitMotion from '$lib/components/submit/SubmitMotion.svelte';
	import SubmitAddNodeProvider from '$lib/components/submit/SubmitAddNodeProvider.svelte';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import SubmitBusy from '$lib/components/submit/SubmitBusy.svelte';
	import { assertAddNodeProviderMetadata } from '$lib/services/submit.services';

	const { store }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);

	const dispatch = createEventDispatcher();
	const next = async () => {
		if ($store?.metadata?.proposalAction !== 'AddOrRemoveNodeProvider') {
			dispatch('pnwrkNext');
			return;
		}

		const { valid } = await assertAddNodeProviderMetadata($store.metadata);

		if (!valid) {
			return;
		}

		dispatch('pnwrkNext');
	};
</script>

<SubmitBusy />

{#if $store?.metadata?.proposalAction === 'AddOrRemoveNodeProvider'}
	<SubmitAddNodeProvider />
{:else if $store?.metadata?.proposalAction === 'CreateServiceNervousSystem'}
	<SubmitMotion />
{:else}
	<SubmitMotion />
{/if}

<SubmitContinue on:click={next} />
