<script lang="ts">
	import UserProposalViewLink from '$lib/components/proposals/UserProposalViewLink.svelte';
	import IconDelete from '$lib/components/icons/IconDelete.svelte';
	import IconView from '$lib/components/icons/IconView.svelte';
	import type { ProposalMetadataDoc } from '$lib/types/juno';
	import { createEventDispatcher } from 'svelte';

	export let doc: ProposalMetadataDoc;

	const dispatch = createEventDispatcher();
	const doDelete = () => dispatch('pnwrkDelete');
</script>

<UserProposalViewLink {doc} on:click={close}>
	<IconView size="20" /> View
</UserProposalViewLink>

{#if doc.data.status === 'draft'}
	<button class="flex gap-2 items-center mt-2" on:click={doDelete}>
		<IconDelete size="20" /> Delete
	</button>
{/if}
