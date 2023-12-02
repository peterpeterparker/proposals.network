<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { isNullish } from '@dfinity/utils';
	import IconUndo from '$lib/components/icons/IconUndo.svelte';
	import ButtonIcon from '$lib/components/ui/ButtonIcon.svelte';
	import IconRedo from '$lib/components/icons/IconRedo.svelte';
	import IconBold from '$lib/components/icons/IconBold.svelte';
	import IconItalic from '$lib/components/icons/IconItalic.svelte';
	import IconUnderline from '$lib/components/icons/IconUnderline.svelte';
	import IconStrikeThrough from '$lib/components/icons/IconStrikeThrough.svelte';
	import IconLink from '$lib/components/icons/IconLink.svelte';
	import IconH1 from '$lib/components/icons/IconH1.svelte';
	import IconH2 from '$lib/components/icons/IconH2.svelte';
	import IconH3 from '$lib/components/icons/IconH3.svelte';
	import IconUnorderedList from '$lib/components/icons/IconUnorderedList.svelte';
	import IconOrderedList from '$lib/components/icons/IconOrderedList.svelte';

	export let editor: Editor | undefined;

	let disabled = true;
	$: disabled = isNullish(editor);

	const setUnsetLink = () => {
		if (isNullish(editor)) {
			return;
		}

		if (editor.isActive('link') === true) {
			editor.chain().focus().unsetLink().run();
			return;
		}

		const previousUrl = editor.getAttributes('link').href;
		const url = window.prompt('URL', previousUrl);

		// cancelled
		if (isNullish(url)) {
			return;
		}

		// empty
		if (url === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();
			return;
		}

		// update link
		editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run();
	};
</script>

<ButtonIcon
		ariaLabel="Undo"
		disabled={disabled || editor?.can().redo()}
		on:click={() => editor?.chain().focus().undo().run()}
>
	<IconUndo />
</ButtonIcon>

<ButtonIcon
		ariaLabel="Redo"
		disabled={disabled || editor?.can().undo()}
		on:click={() => editor?.chain().focus().redo().run()}
>
	<IconRedo />
</ButtonIcon>

<ButtonIcon
		ariaLabel="Bold"
		{disabled}
		active={editor?.isActive('bold') === true}
		on:click={() => editor?.chain().focus().toggleBold().run()}
>
	<IconBold />
</ButtonIcon>

<ButtonIcon
		ariaLabel="Italic"
		{disabled}
		active={editor?.isActive('italic') === true}
		on:click={() => editor?.chain().focus().toggleItalic().run()}
>
	<IconItalic />
</ButtonIcon>

<ButtonIcon
		ariaLabel="Underline"
		{disabled}
		active={editor?.isActive('underline') === true}
		on:click={() => editor?.commands.toggleUnderline()}
>
	<IconUnderline />
</ButtonIcon>

<ButtonIcon
		ariaLabel="Strike through"
		{disabled}
		active={editor?.isActive('strike') === true}
		on:click={() => editor?.commands.toggleStrike()}
>
	<IconStrikeThrough />
</ButtonIcon>

<ButtonIcon
		ariaLabel="Insert a link"
		{disabled}
		active={editor?.isActive('link') === true}
		on:click={setUnsetLink}
>
	<IconLink />
</ButtonIcon>

<ButtonIcon
		ariaLabel="H1"
		{disabled}
		active={editor?.isActive('heading1') === true}
		on:click={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
>
	<IconH1 />
</ButtonIcon>

<ButtonIcon
		ariaLabel="H2"
		{disabled}
		active={editor?.isActive('heading2') === true}
		on:click={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
>
	<IconH2 />
</ButtonIcon>

<ButtonIcon
		ariaLabel="H3"
		{disabled}
		active={editor?.isActive('heading3') === true}
		on:click={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
>
	<IconH3 />
</ButtonIcon>

<ButtonIcon
		ariaLabel="Toggle unordered list"
		{disabled}
		active={editor?.isActive('bulletList') === true}
		on:click={() => editor?.chain().focus().toggleBulletList().run()}
>
	<IconUnorderedList />
</ButtonIcon>

<ButtonIcon
		ariaLabel="Toggle ordered list"
		{disabled}
		active={editor?.isActive('orderedList') === true}
		on:click={() => editor?.chain().focus().toggleOrderedList().run()}
>
	<IconOrderedList />
</ButtonIcon>