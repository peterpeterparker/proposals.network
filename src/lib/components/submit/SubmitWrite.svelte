<script lang="ts">
	import SubmitContinue from '$lib/components/submit/SubmitContinue.svelte';
	import { createEventDispatcher, getContext, SvelteComponent } from 'svelte';
	import SubmitMotion from '$lib/components/submit/SubmitMotion.svelte';
	import SubmitAddNodeProvider from '$lib/components/submit/SubmitAddNodeProvider.svelte';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import SubmitBusy from '$lib/components/submit/SubmitBusy.svelte';

	interface submitAddNodeProviderComponent extends SvelteComponent<object> {
		allFieldsValid(): boolean;
	}

	let submitAddNodeProvider: submitAddNodeProviderComponent;

	const { store }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);

	const dispatch = createEventDispatcher();
	const next = () => {
		if ($store?.metadata?.proposalAction !== 'AddOrRemoveNodeProvider') {
			dispatch('pnwrkNext');
			return;
		}

		if (!submitAddNodeProvider.allFieldsValid()) {
			return;
		}

		dispatch('pnwrkNext');
	};
</script>

<SubmitBusy />

{#if $store?.metadata?.proposalAction === 'AddOrRemoveNodeProvider'}
	<SubmitAddNodeProvider bind:this={submitAddNodeProvider} />
{:else}
	<SubmitMotion />
{/if}

<SubmitContinue on:click={next} />
