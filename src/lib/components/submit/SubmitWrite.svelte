<script lang="ts">
	import Editor from '$lib/components/ui/Editor.svelte';
	import { nonNullish } from '@dfinity/utils';
	import type { ProposalContent } from '$lib/types/juno';
	import { setContent } from '$lib/services/idb.services';
	import SubmitContinue from "$lib/components/submit/SubmitContinue.svelte";
	import {createEventDispatcher} from "svelte";

	export let content: ProposalContent | undefined;

	const onUpdate = async (content: ProposalContent) => await setContent(content);

	const dispatch = createEventDispatcher();
	const next = () => dispatch('pnwrkNext');
</script>

{#if nonNullish(content)}
	<Editor {content} {onUpdate} />

	<SubmitContinue on:click={next} />
{/if}
