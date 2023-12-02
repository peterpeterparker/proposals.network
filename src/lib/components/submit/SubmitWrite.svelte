<script lang="ts">
	import Editor from '$lib/components/ui/Editor.svelte';
	import { nonNullish } from '@dfinity/utils';
	import type { ProposalContent } from '$lib/types/juno';
	import { setContent } from '$lib/services/idb.services';

	export let content: ProposalContent | undefined;

	const onUpdate = async (content: ProposalContent) => await setContent(content);
</script>

{#if nonNullish(content)}
	<Editor {content} {onUpdate} />
{/if}
