<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import EditorToolbar from '$lib/components/ui/EditorToolbar.svelte';
	import EditorBusy from '$lib/components/ui/EditorBusy.svelte';

	export let editor: Editor | undefined;
</script>

<aside
	class="flex flex-wrap gap-0.5 justify-between items-center border-b-2 border-black bg-violet-200 p-4"
>
	<EditorToolbar {editor} />

	<EditorBusy />
</aside>
