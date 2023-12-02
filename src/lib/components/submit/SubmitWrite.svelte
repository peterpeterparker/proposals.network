<script lang="ts">
	import Editor from '$lib/components/ui/Editor.svelte';
	import { nonNullish } from '@dfinity/utils';
	import type { ProposalContent } from '$lib/types/juno';
	import { setContent } from '$lib/services/idb.services';
	import SubmitContinue from "$lib/components/submit/SubmitContinue.svelte";
	import {createEventDispatcher} from "svelte";
	import SubmitMetadata from "$lib/components/submit/SubmitMetadata.svelte";

	export let content: ProposalContent | undefined;

	const onUpdate = async (content: ProposalContent) => await setContent(content);

	const dispatch = createEventDispatcher();
	const next = () => dispatch('pnwrkNext');
</script>

{#if nonNullish(content)}
	<h1 class="font-bold capitalize text-4xl mb-12">Craft Your Proposal</h1>

	<h2 class="text-2xl mb-6">To submit a proposal, you need both a summary (explaining what it's all about) and motion text (the effective motion for voting), along with a title and a URL pointing to your community discussion.</h2>

	<Editor {content} {onUpdate} />

	<SubmitMetadata/>

	<SubmitContinue on:click={next} />
{/if}
