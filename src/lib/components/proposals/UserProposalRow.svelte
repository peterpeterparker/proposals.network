<script lang="ts">
	import type { ProposalKey, ProposalMetadata, ProposalMetadataDoc } from '$lib/types/juno';
	import UserProposalLink from '$lib/components/proposals/UserProposalLink.svelte';
	import UserProposalView from '$lib/components/proposals/UserProposalView.svelte';
	import UserProposalStatus from '$lib/components/proposals/UserProposalStatus.svelte';
	import ProposalLink from '$lib/components/proposals/ProposalLink.svelte';

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
	<ProposalLink id={proposalId} />
	<td class="max-w-lg">{title ?? ''} </td>
	<UserProposalStatus {proposalId} />
	<UserProposalView {key} />
</tr>
