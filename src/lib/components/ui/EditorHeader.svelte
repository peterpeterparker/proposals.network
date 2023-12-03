<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import EditorToolbar from '$lib/components/ui/EditorToolbar.svelte';

	export let editor: Editor | undefined;
</script>

<aside class="flex flex-wrap gap-0.5 border-b-2 border-black bg-violet-200 p-2">
	<EditorToolbar {editor} />
</aside>
