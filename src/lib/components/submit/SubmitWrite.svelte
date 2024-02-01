<script lang="ts">
	import type { ProposalContent } from '$lib/types/juno';
	import SubmitContinue from '$lib/components/submit/SubmitContinue.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import SubmitWriteEdit from '$lib/components/submit/SubmitWriteEdit.svelte';
	import type { ProposalEditableMetadata } from '$lib/types/juno';
	import { getEditable } from '$lib/services/idb.services';

	let metadata: ProposalEditableMetadata | undefined;
	let content: ProposalContent | undefined;

	export let proposalType: string | undefined;

	console.log("Proposal Type: " + proposalType);

	onMount(async () => ([metadata, content] = await getEditable()));

	const dispatch = createEventDispatcher();
	const next = () => dispatch('pnwrkNext');

	$: console.log(proposalType);
</script>

<h1 class="mb-12 text-4xl font-bold capitalize md:text-6xl">Craft Your Proposal</h1>

<h2 class="mb-6 text-2xl">
	To submit a proposal, you need both a summary (explaining what it's all about) and motion text
	(the effective motion for voting), along with a title and a URL pointing to your community
	discussion.
</h2>

<SubmitWriteEdit {metadata} {content} />

<SubmitContinue on:click={next} />
