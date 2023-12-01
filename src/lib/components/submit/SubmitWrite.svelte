<script lang="ts">
	import template from '$lib/markdown/proposal-template.md?raw';
	import { markdownToHTML } from '$lib/utils/html.utils';
	import Editor from '$lib/components/ui/Editor.svelte';
	import { isNullish, nonNullish } from '@dfinity/utils';
	import type { ProposalContent } from '$lib/types/juno';
	import { nanoid } from 'nanoid';
	import { toasts } from '$lib/stores/toasts.store';
	import { set } from '$lib/services/idb.services';
	import { replaceHistory } from '$lib/utils/route.utils';
	import { routeKey } from '$lib/derived/nav.derived';

	let content: string | undefined;
	let proposalKey: string | undefined;

	const updateUrl = (proposalKey: string) => {
		const url: URL = new URL(window.location.href);

		url.searchParams.delete('key');
		url.searchParams.append('key', encodeURI(proposalKey));

		replaceHistory(url);
	};

	const load = async (key: string | undefined | null) => {
		content = await markdownToHTML(template);
		proposalKey = key ?? nanoid();

		if (nonNullish(key)) {
			return;
		}

		updateUrl(proposalKey);
	};

	const onUpdate = async (content: ProposalContent) => {
		if (isNullish(proposalKey)) {
			toasts.error({
				msg: { text: 'Unexpected error, the proposal key is not set.' }
			});
			return;
		}

		await set({ key: proposalKey, content });
	};

	$: $routeKey, (async () => await load($routeKey))();
</script>

{#if nonNullish(content)}
	<Editor {content} {onUpdate} />
{/if}
