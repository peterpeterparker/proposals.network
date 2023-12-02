<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import EditorHeader from '$lib/components/ui/EditorHeader.svelte';
	import { EDITOR_EXTENSIONS } from '$lib/constants/editor.constants';
	import type { Markdown } from '$lib/types/app';

	export let content: Markdown;
	export let onUpdate: (json: Markdown) => Promise<void>;

	let element: HTMLElement;
	let editor: Editor | undefined;

	onMount(
		async () =>
			(editor = new Editor({
				element: element,
				extensions: EDITOR_EXTENSIONS,
				content,
				onTransaction: () => {
					// force re-render so `editor.isActive` works as expected
					editor = editor;
				},
				editorProps: {
					attributes: {
						class:
							'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl my-8 mx-5 focus:outline-none'
					}
				},
				onUpdate: async ({ editor }) => {
					const markdown = editor.storage.markdown.getMarkdown();
					await onUpdate(markdown);
				}
			}))
	);

	onDestroy(() => editor?.destroy());
</script>

<div class="bg-white border-2 border-black lg:rounded-md overflow-hidden mb-8">
	<EditorHeader {editor} />

	<article bind:this={element} />
</div>
