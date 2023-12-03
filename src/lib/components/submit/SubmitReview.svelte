<script lang="ts">
	import type { ProposalContent } from '$lib/types/juno';
	import {createEventDispatcher, onMount} from 'svelte';
	import { nonNullish } from '@dfinity/utils';
	import Html from '$lib/components/ui/Html.svelte';
	import { fade } from 'svelte/transition';
	import SubmitError from '$lib/components/submit/SubmitError.svelte';
	import Copy from '$lib/components/ui/Copy.svelte';
	import { markdownToHTML } from '$lib/utils/markdown.utils';
	import ButtonText from '$lib/components/ui/ButtonText.svelte';
	import { isBusy } from '$lib/derived/busy.derived';
	import Button from '$lib/components/ui/Button.svelte';
	import type { ProposalEditableMetadata } from '$lib/types/juno';
	import { getEditable } from '$lib/services/idb.services';
	import SubmitReviewBlock from '$lib/components/submit/SubmitReviewBlock.svelte';
	import {submitProposal} from "$lib/services/submit.services";
	import {userStore} from "$lib/stores/user.store";

	export let neuronId: bigint | undefined;

	let metadata: ProposalEditableMetadata | undefined;
	let content: ProposalContent | undefined;

	onMount(async () => ([metadata, content] = await getEditable()));

	let html: string | undefined;
	let markdown: string | undefined;
	onMount(async () => {
		[metadata, content] = await getEditable();

		html = nonNullish(content) ? await markdownToHTML(content) : undefined;
		markdown = content?.replaceAll('\n', '<br/>');
	});

	let display: 'html' | 'markdown' = 'html';

	const dispatch = createEventDispatcher();

	const onSubmit = async () => {
		const {result} = await submitProposal({user: $userStore, neuronId});

		if (result === "error") {
			return;
		}

		dispatch('pnwrkNext');
	};

	const edit = () => dispatch('pnwrkEdit');
</script>

{#if nonNullish(html) && nonNullish(markdown) && nonNullish(neuronId)}
	<form on:submit|preventDefault={onSubmit}>
		<h1 class="font-bold capitalize text-4xl mb-12">
			Make sure everything looks good before submitting!
		</h1>

		<p class="leading-relaxed mb-8">
			Review your proposal for Neuron ID: <Copy value={`${neuronId}`} text="Neuron ID copied." />.
		</p>

		<div in:fade>
			<SubmitReviewBlock>
				<aside slot="actions">The proposal title</aside>
				<article class="p-2.5">{metadata?.title ?? ''}</article>
			</SubmitReviewBlock>

			<SubmitReviewBlock>
				<svelte:fragment slot="actions"
					><ButtonText active={display === 'html'} on:click={() => (display = 'html')}
						>HTML</ButtonText
					>
					<ButtonText active={display === 'markdown'} on:click={() => (display = 'markdown')}
						>Markdown</ButtonText
					></svelte:fragment
				>
				<article class="py-8 px-5">
					{#if display === 'html'}
						<div in:fade><Html text={html} /></div>
					{:else}
						<div in:fade><Html text={markdown} /></div>
					{/if}
				</article>
			</SubmitReviewBlock>

			<SubmitReviewBlock>
				<aside slot="actions">An URL pointing to the forum</aside>
				<article class="p-2.5">{metadata?.url ?? ''}</article>
			</SubmitReviewBlock>

			<SubmitReviewBlock>
				<aside slot="actions">Your motion text</aside>
				<article class="p-2.5">{metadata?.motionText ?? ''}</article>
			</SubmitReviewBlock>
		</div>

		<div class="flex gap-2">
			<Button color="quaternary" type="button" disabled={$isBusy} on:click={edit}>Edit</Button>
			<Button color="tertiary" type="submit" disabled={$isBusy}>Submit</Button>
		</div>
	</form>
{:else}
	<SubmitError />
{/if}
