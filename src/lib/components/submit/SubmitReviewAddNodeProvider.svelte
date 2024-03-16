<script lang="ts">
	import { fade } from 'svelte/transition';
	import Container from '$lib/components/ui/Container.svelte';
	import type { ProposalEditableMetadata } from '$lib/types/juno';

	export let metadata: ProposalEditableMetadata | undefined;
</script>

<div in:fade>
	<Container>
		<aside slot="title">Provider's Name</aside>
		<article class="p-2.5">{metadata?.title ?? ''}</article>
	</Container>

	<Container>
		<aside slot="title">Summary</aside>
		<article class="p-2.5">{metadata?.summary ?? ''}</article>
	</Container>

	<Container>
		<aside slot="title">The principal ID of the provider</aside>
		<article class="p-2.5">{metadata?.nodeProviderId ?? ''}</article>
	</Container>
</div>
