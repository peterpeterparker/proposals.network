import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
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
	}),
	Table.configure({
		resizable: true
	}),
	TableRow,
	TableHeader,
	TableCell
];
