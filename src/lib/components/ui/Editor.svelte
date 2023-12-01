<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor, type JSONContent } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Highlight from '@tiptap/extension-highlight';
	import Typography from '@tiptap/extension-typography';
	import Underline from '@tiptap/extension-underline';
	import Link from '@tiptap/extension-link';
	import EditorToolbar from '$lib/components/ui/EditorToolbar.svelte';

	export let content: string;
	export let onUpdate: (json: JSONContent) => Promise<void>;

	let element: HTMLElement;
	let editor: Editor | undefined;

	onMount(
		async () =>
			(editor = new Editor({
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
					const json = editor.getJSON();
					await onUpdate(json);
				}
			}))
	);

	onDestroy(() => editor?.destroy());
</script>

<div class="bg-white border-2 border-black lg:rounded-md overflow-hidden">
	<EditorToolbar {editor} />

	<article bind:this={element} />
</div>
