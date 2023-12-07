import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { common, createLowlight } from 'lowlight';
import { Markdown } from 'tiptap-markdown';

export const EDITOR_EXTENSIONS = [
	StarterKit.configure({
		codeBlock: false
	}),
	Highlight,
	Typography,
	Underline,
	Link.configure({
		HTMLAttributes: {
			rel: 'noopener noreferrer nofollow'
		}
	}).extend({
		inclusive: false
	}),
	Markdown,
	CodeBlockLowlight.configure({
		lowlight: createLowlight(common)
	})
];
