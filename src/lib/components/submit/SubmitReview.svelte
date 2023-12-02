<script lang="ts">
	import type { ProposalContent } from '$lib/types/juno';
	import { generateHTML } from '@tiptap/core';
	import { onMount } from 'svelte';
	import { nonNullish } from '@dfinity/utils';
	import { EDITOR_EXTENSIONS } from '$lib/constants/editor.constants';
	import Html from '$lib/components/ui/Html.svelte';
	import { fade } from 'svelte/transition';
	import SubmitError from '$lib/components/submit/SubmitError.svelte';
	import Copy from "$lib/components/ui/Copy.svelte";

	export let neuronId: bigint | undefined;
	export let content: ProposalContent | undefined;

	let html: string | undefined;
	onMount(
		() => (html = nonNullish(content) ? generateHTML(content, EDITOR_EXTENSIONS) : undefined)
	);
</script>

{#if nonNullish(html) && nonNullish(neuronId)}
	<h1 class="font-bold capitalize text-4xl mb-12">Make sure everything looks good before submitting!</h1>

	<p class="leading-relaxed mb-8">
		Review your proposal for Neuron ID: <Copy value={`${neuronId}`} text="Neuron ID copied." />.
	</p>

	<div
		in:fade
		class="tiptap py-8 px-5 focus:outline-none bg-white border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] lg:rounded-md overflow-hidden mb-8"
	>
		<Html text={html} />
	</div>
{:else}
	<SubmitError />
{/if}
