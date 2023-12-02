import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';

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
	})
];
