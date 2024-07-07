<script lang="ts">
	import { getEditable, setContent } from '$lib/services/idb.services';
	import { nonNullish } from '@dfinity/utils';
	import type { ProposalContent } from '$lib/types/juno';
	import Editor from '$lib/components/ui/Editor.svelte';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import { getContext } from 'svelte';

	const { store }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);

	let content: ProposalContent | undefined;

	const init = async () => {
		const [_, existingContent, __] = await getEditable();
		content = existingContent;
	};

	$: $store, (async () => await init())();

	const onUpdate = async (content: ProposalContent) => await setContent(content);
</script>

{#if nonNullish(content)}
	<slot name="before" />

	<Editor {content} {onUpdate} />

	<slot name="after" />
{/if}
