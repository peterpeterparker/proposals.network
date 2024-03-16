<script lang="ts">
	import type { ProposalContent } from '$lib/types/juno';
	import { createEventDispatcher, onMount } from 'svelte';
	import { nonNullish } from '@dfinity/utils';
	import SubmitError from '$lib/components/submit/SubmitError.svelte';
	import Copy from '$lib/components/ui/Copy.svelte';
	import { isBusy } from '$lib/derived/busy.derived';
	import Button from '$lib/components/ui/Button.svelte';
	import type { ProposalEditableMetadata } from '$lib/types/juno';
	import { getEditable } from '$lib/services/idb.services';
	import { submitProposal } from '$lib/services/submit.services';
	import { userStore } from '$lib/stores/user.store';
	import { governanceStore } from '$lib/derived/governance.derived';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import { getContext } from 'svelte';
	import SubmitReviewAddNodeProvider from '$lib/components/submit/SubmitReviewAddNodeProvider.svelte';
	import SubmitReviewMotion from '$lib/components/submit/SubmitReviewMotion.svelte';

	export let neuronId: string | undefined;

	const { store }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);

	let metadata: ProposalEditableMetadata | undefined;
	let content: ProposalContent | undefined;

	onMount(async () => {
		[metadata, content] = await getEditable();
	});

	const dispatch = createEventDispatcher();

	const onSubmit = async () => {
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
	<h1 class="mb-12 text-4xl font-bold capitalize md:text-6xl">
		Make sure everything looks good before submitting!
	</h1>

	<p class="mb-8 leading-relaxed">
		Review your proposal for Neuron ID: <Copy value={`${neuronId}`} text="Neuron ID copied." />.
	</p>

	<!-- TODO: Use the context directly within the component instead of passing the metadata -->
	{#if $store?.metadata?.proposalAction === 'AddOrRemoveNodeProvider'}
		<SubmitReviewAddNodeProvider metadata={$store?.metadata} />
	{:else}
		<form on:submit|preventDefault={onSubmit}>
			<SubmitReviewMotion {metadata} {content} />
		</form>
	{/if}

	<div class="flex gap-2">
		<Button color="quaternary" type="button" disabled={$isBusy} on:click={edit}>Edit</Button>
		<Button color="tertiary" type="submit" disabled={$isBusy}>Submit</Button>
	</div>
{:else}
	<SubmitError />
{/if}
