<script lang="ts">
	import type { ProposalKey, ProposalMetadata, ProposalMetadataDoc } from '$lib/types/juno';
	import { nonNullish } from '@dfinity/utils';

	export let doc: ProposalMetadataDoc;

	let key: ProposalKey;
	let data: ProposalMetadata;

	$: ({ key, data } = doc);

	let title: string;
	let proposalId: bigint | undefined;

	$: ({ title, proposalId } = data);
</script>

<tr>
	<td>{key}</td>
	<td>
		{#if nonNullish(proposalId)}
			{proposalId}
		{:else}
			—
		{/if}</td
	>
	<td>{title} </td>
	<td></td>
    <td></td>
    <td></td>
</tr>
