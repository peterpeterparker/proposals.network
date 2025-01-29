<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import { EDITOR_EXTENSIONS } from '$lib/constants/editor.constants';
	import type { Markdown } from '$lib/types/core';

	export let content: Markdown;
	export let onUpdate: ((json: Markdown) => Promise<void>) | undefined = undefined;
	export let editable = true;
	export let editor: Editor | undefined = undefined;

	let element: HTMLElement;

	onMount(
		async () =>
			(editor = new Editor({
				element,
				extensions: EDITOR_EXTENSIONS,
				editable,
				content,
				onTransaction: () => {
					// force re-render so `editor.isActive` works as expected
					editor = editor;
				},
				editorProps: {
					attributes: {
						class:
							'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl my-8 mx-5 focus:outline-none overflow-x-auto'
					}
				},
				onUpdate: async ({ editor }) => {
					const markdown = editor.storage.markdown.getMarkdown();
					await onUpdate?.(markdown);
				}
			}))
	);

	onDestroy(() => editor?.destroy());
</script>

<article bind:this={element}></article>
