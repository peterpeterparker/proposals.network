<!-- ProposalDetails.svelte -->
<script lang="ts">
	import { fade } from 'svelte/transition';
	import Container from '$lib/components/ui/Container.svelte';
	import HtmlMarkdown from '$lib/components/ui/HtmlMarkdown.svelte';
	import type { ProposalEditableMetadata } from '$lib/types/juno';
	import type { ProposalContent } from '$lib/types/juno';

	export let metadata: ProposalEditableMetadata | undefined;
	export let content: ProposalContent | undefined;

	// You can add any additional logic needed here
</script>

<div in:fade>
	<Container>
		<aside slot="title">The proposal title</aside>
		<article class="p-2.5">{metadata?.title ?? ''}</article>
	</Container>

	<HtmlMarkdown {content} />

	<Container>
		<aside slot="title">An URL pointing to the forum</aside>
		<article class="p-2.5">{metadata?.url ?? ''}</article>
	</Container>

	<Container>
		<aside slot="title">Your motion text</aside>
		<article class="p-2.5">{metadata?.motionText ?? ''}</article>
	</Container>
</div>
