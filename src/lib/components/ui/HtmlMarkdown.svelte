<script lang="ts">
	import ButtonText from '$lib/components/ui/ButtonText.svelte';
	import Container from '$lib/components/ui/Container.svelte';
	import Html from '$lib/components/ui/Html.svelte';
	import type { Markdown } from '$lib/types/core';
	import { onMount } from 'svelte';
	import { nonNullish } from '@dfinity/utils';
	import { markdownToHTML } from '$lib/utils/markdown.utils';
	import { fade } from 'svelte/transition';
	import EditorContent from '$lib/components/ui/EditorContent.svelte';

	export let content: Markdown | undefined;

	let html: string | undefined;
	let markdown: string | undefined;

	let display: 'html' | 'markdown' = 'html';

	onMount(async () => {
		html = nonNullish(content) ? await markdownToHTML(content) : undefined;
		markdown = content?.replaceAll('\n', '<br/>');
	});
</script>

<Container>
	<svelte:fragment slot="title"
		><ButtonText active={display === 'html'} on:click={() => (display = 'html')}>HTML</ButtonText>
		<ButtonText active={display === 'markdown'} on:click={() => (display = 'markdown')}
			>Markdown</ButtonText
		></svelte:fragment
	>
	{#if display === 'html'}
		<div in:fade>
			{#if nonNullish(html)}
				<EditorContent content={html} editable={false} />
			{/if}
		</div>
	{:else}
		<div in:fade><Html text={markdown} /></div>
	{/if}
</Container>
