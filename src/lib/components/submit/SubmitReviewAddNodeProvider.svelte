<script lang="ts">
	import Container from '$lib/components/ui/Container.svelte';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import { getContext } from 'svelte';

	const { store }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);
</script>

<Container>
	<aside slot="title">Provider's Name</aside>
	<article class="p-2.5">{$store?.metadata?.title ?? ''}</article>
</Container>

<Container>
	<aside slot="title">Summary</aside>
	<article class="p-2.5">{$store?.metadata?.summary ?? ''}</article>
</Container>

<Container>
	<aside slot="title">The principal ID of the provider</aside>
	<article class="p-2.5">{$store?.metadata?.nodeProviderId ?? ''}</article>
</Container>
