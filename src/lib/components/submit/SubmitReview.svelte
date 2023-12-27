<script lang="ts">
	import type { ProposalContent } from '$lib/types/juno';
	import { createEventDispatcher, onMount } from 'svelte';
	import { nonNullish } from '@dfinity/utils';
	import { fade } from 'svelte/transition';
	import SubmitError from '$lib/components/submit/SubmitError.svelte';
	import Copy from '$lib/components/ui/Copy.svelte';
	import { isBusy } from '$lib/derived/busy.derived';
	import Button from '$lib/components/ui/Button.svelte';
	import type { ProposalEditableMetadata } from '$lib/types/juno';
	import { getEditable } from '$lib/services/idb.services';
	import Container from '$lib/components/ui/Container.svelte';
	import { submitProposal } from '$lib/services/submit.services';
	import { userStore } from '$lib/stores/user.store';
	import HtmlMarkdown from '$lib/components/ui/HtmlMarkdown.svelte';
	import { governanceStore } from '$lib/derived/governance.derived';

	export let neuronId: string | undefined;

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
	<form on:submit|preventDefault={onSubmit}>
		<h1 class="font-bold capitalize text-4xl md:text-6xl mb-12">
			Make sure everything looks good before submitting!
		</h1>

		<p class="leading-relaxed mb-8">
			Review your proposal for Neuron ID: <Copy value={`${neuronId}`} text="Neuron ID copied." />.
		</p>

		<div in:fade>
			<Container>
				<aside slot="title">The proposal title</aside>
				<article class="p-2.5">{metadata?.title ?? ''}</article>
			</Container>

			<HtmlMarkdown {content} />

			<Container>
				<aside slot="title">An URL pointing to the forum</aside>
				<article class="p-2.5">{metadata?.url ?? ''}</article>
			</Container>

			<Container>
				<aside slot="title">Your motion text</aside>
				<article class="p-2.5">{metadata?.motionText ?? ''}</article>
			</Container>
		</div>

		<div class="flex gap-2">
			<Button color="quaternary" type="button" disabled={$isBusy} on:click={edit}>Edit</Button>
			<Button color="tertiary" type="submit" disabled={$isBusy}>Submit</Button>
		</div>
	</form>
{:else}
	<SubmitError />
{/if}
