<script lang="ts">
	import type { ProposalKey, ProposalMetadata, ProposalMetadataDoc } from '$lib/types/juno';
	import UserProposalLink from '$lib/components/proposals/UserProposalLink.svelte';
	import UserProposalView from '$lib/components/proposals/UserProposalView.svelte';
	import UserProposalStatus from '$lib/components/proposals/UserProposalStatus.svelte';
	import ProposalLink from '$lib/components/proposals/ProposalLink.svelte';
	import UserProposalGovernance from '$lib/components/proposals/UserProposalGovernance.svelte';

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
	<UserProposalGovernance {doc} />
	<ProposalLink id={proposalId} />
	<td class="max-w-lg truncate">{title ?? ''}</td>
	<UserProposalStatus {proposalId} />
	<UserProposalView {doc} />
</tr>
