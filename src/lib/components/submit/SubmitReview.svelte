<script lang="ts">
	import type { ProposalContent } from '$lib/types/juno';
	import { onMount } from 'svelte';
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

	const onSubmit = async () => {
		// TODO
		console.log("TODO")
	};
</script>

{#if nonNullish(html) && nonNullish(markdown) && nonNullish(neuronId)}
	<form on:submit|preventDefault={onSubmit}>
		<h1 class="font-bold capitalize text-4xl mb-12">
			Make sure everything looks good before submitting!
		</h1>

		<p class="leading-relaxed mb-8">
			Review your proposal for Neuron ID: <Copy value={`${neuronId}`} text="Neuron ID copied." />.
		</p>

		<div
			in:fade
			class="tiptap focus:outline-none bg-white border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] lg:rounded-md overflow-hidden mb-8"
		>
			<aside class="flex flex-wrap gap-2 items-center border-b-2 border-black bg-violet-200 p-4">
				<ButtonText active={display === 'html'} on:click={() => (display = 'html')}>HTML</ButtonText
				>
				<ButtonText active={display === 'markdown'} on:click={() => (display = 'markdown')}
					>Markdown</ButtonText
				>
			</aside>

			<article class="py-8 px-5">
				{#if display === 'html'}
					<div in:fade><Html text={html} /></div>
				{:else}
					<div in:fade><Html text={markdown} /></div>
				{/if}
			</article>
		</div>
		<Button color="tertiary" role="submit" disabled={$isBusy}>Submit</Button>
	</form>
{:else}
	<SubmitError />
{/if}
