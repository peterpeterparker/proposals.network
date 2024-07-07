<script lang="ts">
	import Container from '$lib/components/ui/Container.svelte';
	import HtmlMarkdown from '$lib/components/ui/HtmlMarkdown.svelte';
	import type { ProposalContent } from '$lib/types/juno';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import { getContext } from 'svelte';
	import AttachmentLink from '$lib/components/ui/AttachmentLink.svelte';

	export let content: ProposalContent | undefined;

	const { assets }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);

	$: console.log($assets?.['sns-logo'] ?? '');
</script>

<Container>
	<aside slot="title">Initial parameters</aside>
	<article class="p-2.5">
		<AttachmentLink href={$assets?.['sns-parameters'] ?? ''}>File attached.</AttachmentLink>
	</article>
</Container>

<Container>
	<aside slot="title">Logo of the Dao and Token</aside>
	<article class="p-2.5">
		<AttachmentLink href={$assets?.['sns-logo'] ?? ''} target="_blank"
			>File attached.</AttachmentLink
		>
	</article>
</Container>

<HtmlMarkdown {content} />
