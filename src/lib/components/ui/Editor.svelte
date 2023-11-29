<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Highlight from '@tiptap/extension-highlight';
	import Typography from '@tiptap/extension-typography';
	import my_markdown from '$lib/markdown/proposal-template.md?raw';
	import { markdownToHTML } from '$lib/utils/html.utils';
	import Underline from '@tiptap/extension-underline';
	import Link from '@tiptap/extension-link';
	import EditorToolbar from '$lib/components/ui/EditorToolbar.svelte';

	let element: HTMLElement;
	let editor: Editor | undefined;

	// https://codesandbox.io/p/sandbox/tiptap-react-ts-simple-text-editor-hcyp3l?file=%2Fsrc%2FLinkModal.tsx

	onMount(async () => {
		const html = await markdownToHTML(my_markdown);

		editor = new Editor({
			element: element,
			extensions: [
				StarterKit,
				Highlight,
				Typography,
				Underline,
				Link.configure({
					HTMLAttributes: {
						rel: 'noopener noreferrer'
					}
				}).extend({
					inclusive: false
				})
			],
			content: html,
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			},
			editorProps: {
				attributes: {
					class:
						'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none'
				}
			}
		});
	});

	onDestroy(() => editor?.destroy());
</script>

<div class="bg-white border-2 border-black lg:rounded-md overflow-hidden">
	<EditorToolbar {editor} />

	<article bind:this={element} />
</div>
