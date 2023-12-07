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

<h1 class="font-bold capitalize text-4xl md:text-6xl mb-12">Craft Your Proposal</h1>

<h2 class="text-2xl mb-6">
	To submit a proposal, you need both a summary (explaining what it's all about) and motion text
	(the effective motion for voting), along with a title and a URL pointing to your community
	discussion.
</h2>

<p class="leading-relaxed text-sm mt-4 mb-8 italic">
	Currently, only motion proposals are supported. However, if you wish to expand the dApp to include
	more types, please <a
		href="https://twitter.com/daviddalbusco"
		target="_blank"
		class="underline underline-offset-2"
		rel="noopener noreferrer nofollow">reach out</a
	>
	or send a pull request on the
	<a
		href="https://github.com/peterpeterparker/proposals.network"
		target="_blank"
		class="underline underline-offset-2"
		rel="noopener noreferrer nofollow">GitHub repository</a
	>.
</p>

<SubmitWriteEdit {metadata} {content} />

<SubmitContinue on:click={next} />
