<script lang="ts">
	import SubmitContinue from '$lib/components/submit/SubmitContinue.svelte';
	import { createEventDispatcher, getContext } from 'svelte';
	import SubmitMotion from '$lib/components/submit/SubmitMotion.svelte';
	import SubmitAddNodeProvider from '$lib/components/submit/SubmitAddNodeProvider.svelte';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import SubmitBusy from '$lib/components/submit/SubmitBusy.svelte';
	import { assertAddNodeProviderMetadata } from '$lib/services/submit.services';
	import SubmitSns from '$lib/components/submit/SubmitSns.svelte';
	import { assertCreateServiceNervousSystemAssets } from '$lib/services/submit.sns.services';

	const { store }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);

	const dispatch = createEventDispatcher();
	const next = async () => {
		if ($store?.metadata?.proposalAction === 'AddOrRemoveNodeProvider') {
			const { valid } = await assertAddNodeProviderMetadata($store.metadata);

			if (!valid) {
				return;
			}

			dispatch('pnwrkNext');
		}

		if ($store?.metadata?.proposalAction === 'CreateServiceNervousSystem') {
			const { valid } = await assertCreateServiceNervousSystemAssets($store?.key);

			if (!valid) {
				return;
			}

			dispatch('pnwrkNext');
		}

		dispatch('pnwrkNext');
		return;
	};
</script>

<SubmitBusy />

{#if $store?.metadata?.proposalAction === 'AddOrRemoveNodeProvider'}
	<SubmitAddNodeProvider />
{:else if $store?.metadata?.proposalAction === 'CreateServiceNervousSystem'}
	<SubmitSns />
{:else}
	<SubmitMotion />
{/if}

<SubmitContinue on:click={next} />
