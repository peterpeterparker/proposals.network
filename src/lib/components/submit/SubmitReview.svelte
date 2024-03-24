<script lang="ts">
	import type { ProposalContent } from '$lib/types/juno';
	import { createEventDispatcher, onMount } from 'svelte';
	import { nonNullish } from '@dfinity/utils';
	import SubmitError from '$lib/components/submit/SubmitError.svelte';
	import Copy from '$lib/components/ui/Copy.svelte';
	import { isBusy } from '$lib/derived/busy.derived';
	import Button from '$lib/components/ui/Button.svelte';
	import { getEditable } from '$lib/services/idb.services';
	import {
		submitMotionProposal,
		submitAddNodeProviderProposal
	} from '$lib/services/submit.services';
	import { userStore } from '$lib/stores/user.store';
	import { governanceStore } from '$lib/derived/governance.derived';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import { getContext } from 'svelte';
	import SubmitReviewAddNodeProvider from '$lib/components/submit/SubmitReviewAddNodeProvider.svelte';
	import SubmitReviewMotion from '$lib/components/submit/SubmitReviewMotion.svelte';
	import { fade } from 'svelte/transition';

	export let neuronId: string | undefined;

	const { store }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);

	let content: ProposalContent | undefined;

	onMount(async () => {
		const [_, c] = await getEditable();
		content = c;
	});

	const dispatch = createEventDispatcher();

	const onSubmit = async () => {
		const submitProposal = $store?.metadata?.proposalAction === 'AddOrRemoveNodeProvider' ? submitAddNodeProviderProposal : submitMotionProposal;

		const { result, proposalId } = await submitProposal({
			user: $userStore,
			neuronId,
			governance: $governanceStore
		});

		if (result === 'error') {
			return;
		}

		dispatch('pnwrkDone', proposalId);
	};

	const edit = () => dispatch('pnwrkEdit');
</script>

{#if nonNullish(neuronId) && nonNullish(content)}
	<form on:submit|preventDefault={onSubmit}>
		<h1 class="font-bold capitalize text-4xl md:text-6xl mb-12">
			Make sure everything looks good before submitting!
		</h1>

		<p class="leading-relaxed mb-8">
			Review your proposal for Neuron ID: <Copy value={`${neuronId}`} text="Neuron ID copied." />.
		</p>

		<div in:fade>
			{#if $store?.metadata?.proposalAction === 'AddOrRemoveNodeProvider'}
				<SubmitReviewAddNodeProvider />
			{:else}
				<SubmitReviewMotion {content} />
			{/if}
		</div>

		<div class="flex gap-2">
			<Button color="quaternary" type="button" disabled={$isBusy} on:click={edit}>Edit</Button>
			<Button color="tertiary" type="submit" disabled={$isBusy}>Submit</Button>
		</div>
	</form>
{:else}
	<SubmitError />
{/if}
