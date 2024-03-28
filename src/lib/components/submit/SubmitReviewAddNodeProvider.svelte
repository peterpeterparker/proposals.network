<script lang="ts">
	import Container from '$lib/components/ui/Container.svelte';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import { getContext } from 'svelte';

	const { store }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);
</script>

<Container>
	<aside slot="title">Provider's Name</aside>
	<article class="p-2.5">{$store?.metadata?.nodeProviderName ?? ''}</article>
</Container>

<Container>
	<aside slot="title">URL to your forum announcement and discussion</aside>
	<article class="p-2.5">{$store?.metadata?.url ?? ''}</article>
</Container>

<Container>
	<aside slot="title">URL to your self-declaration document</aside>
	<article class="p-2.5">{$store?.metadata?.urlSelfDeclaration ?? ''}</article>
</Container>

<Container>
	<aside slot="title">SHA256 hash of your self-declaration document</aside>
	<article class="p-2.5">{$store?.metadata?.hashSelfDeclaration ?? ''}</article>
</Container>

<Container>
	<aside slot="title">URL to your proof of identiy document</aside>
	<article class="p-2.5">{$store?.metadata?.urlIdentityProof ?? ''}</article>
</Container>

<Container>
	<aside slot="title">SHA256 hash of your proof of identity document</aside>
	<article class="p-2.5">{$store?.metadata?.hashIdentityProof ?? ''}</article>
</Container>

<Container>
	<aside slot="title">The principal ID of the provider</aside>
	<article class="p-2.5">{$store?.metadata?.nodeProviderId ?? ''}</article>
</Container>
