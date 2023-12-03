<script lang="ts">
	import type { ProposalContent } from '$lib/types/juno';
	import SubmitContinue from '$lib/components/submit/SubmitContinue.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import SubmitWriteEdit from '$lib/components/submit/SubmitWriteEdit.svelte';
	import type { ProposalEditableMetadata } from '$lib/types/juno';
	import { getEditable } from '$lib/services/idb.services';

	let metadata: ProposalEditableMetadata | undefined;
	let content: ProposalContent | undefined;

	onMount(async () => ([metadata, content] = await getEditable()));

	const dispatch = createEventDispatcher();
	const next = () => dispatch('pnwrkNext');
</script>

<h1 class="font-bold capitalize text-4xl mb-12">Craft Your Proposal</h1>

<h2 class="text-2xl mb-6">
	To submit a proposal, you need both a summary (explaining what it's all about) and motion text
	(the effective motion for voting), along with a title and a URL pointing to your community
	discussion.
</h2>

<SubmitWriteEdit {metadata} {content} />

<SubmitContinue on:click={next} />
