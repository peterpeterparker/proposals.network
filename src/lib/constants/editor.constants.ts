import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';

export const EDITOR_EXTENSIONS = [
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
	}),
	Markdown
];
