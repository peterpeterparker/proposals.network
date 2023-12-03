<script lang="ts">
	import type { ProposalKey, ProposalMetadata, ProposalMetadataDoc } from '$lib/types/juno';
	import { nonNullish } from '@dfinity/utils';
	import UserProposalLink from '$lib/components/proposals/UserProposalLink.svelte';
	import UserProposalView from '$lib/components/proposals/UserProposalView.svelte';

	export let doc: ProposalMetadataDoc;

	let key: ProposalKey;
	let data: ProposalMetadata;

	$: ({ key, data } = doc);

	let title: string | undefined;
	let proposalId: bigint | undefined;

	$: ({ title, proposalId } = data);
</script>

<tr>
	<UserProposalLink {key} />
	<td>
		{#if nonNullish(proposalId)}
			{proposalId}
		{:else}
			—
		{/if}</td
	>
	<td>{title ?? ''} </td>
	<td></td>
	<td></td>
	<UserProposalView {key} />
</tr>
