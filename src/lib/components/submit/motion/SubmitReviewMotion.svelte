<script lang="ts">
	import Container from '$lib/components/ui/Container.svelte';
	import HtmlMarkdown from '$lib/components/ui/HtmlMarkdown.svelte';
	import type { ProposalContent } from '$lib/types/juno';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import { getContext } from 'svelte';

	export let content: ProposalContent | undefined;

	const { store }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);
</script>

<Container>
	<aside slot="title">The proposal title</aside>
	<article class="p-2.5">{$store?.metadata?.title ?? ''}</article>
</Container>

<HtmlMarkdown {content} />

<Container>
	<aside slot="title">An URL pointing to the forum</aside>
	<article class="p-2.5">{$store?.metadata?.url ?? ''}</article>
</Container>

<Container>
	<aside slot="title">Your motion text</aside>
	<article class="p-2.5">{$store?.metadata?.motionText ?? ''}</article>
</Container>
