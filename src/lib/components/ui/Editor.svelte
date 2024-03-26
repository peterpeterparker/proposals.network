<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import EditorHeader from '$lib/components/ui/EditorHeader.svelte';
	import type { Markdown } from '$lib/types/core';
	import EditorContent from '$lib/components/ui/EditorContent.svelte';

	export let content: Markdown;
	export let onUpdate: (json: Markdown) => Promise<void>;

	let editor: Editor | undefined;
</script>

<div class="bg-white border-2 border-black lg:rounded-md overflow-hidden mb-8">
	<EditorHeader {editor} />

	<EditorContent bind:editor {content} {onUpdate} />
</div>
