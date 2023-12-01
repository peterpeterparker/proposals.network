<script lang="ts">
	import template from '$lib/markdown/proposal-template.md?raw';
	import { markdownToHTML } from '$lib/utils/html.utils';

	import { onMount } from 'svelte';
	import Editor from '$lib/components/ui/Editor.svelte';
	import { nonNullish } from '@dfinity/utils';

	let content: string | undefined;

	onMount(async () => (content = await markdownToHTML(template)));
</script>

{#if nonNullish(content)}
	<Editor {content} />
{/if}
