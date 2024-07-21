<script lang="ts">
	import type {
		ProposalDescription,
		ProposalKey,
		ProposalMetadata,
		ProposalMetadataDoc
	} from '$lib/types/juno';
	import UserProposalLink from '$lib/components/proposals/UserProposalLink.svelte';
	import UserProposalView from '$lib/components/proposals/UserProposalView.svelte';
	import UserProposalStatus from '$lib/components/proposals/UserProposalStatus.svelte';
	import ProposalLink from '$lib/components/proposals/ProposalLink.svelte';
	import GovernanceCell from '$lib/components/governance/GovernanceCell.svelte';
	import type { Governance } from '$lib/types/governance';
	import { findGovernance } from '$lib/utils/governance.utils';
	import { GOVERNANCE_CANISTER_ID } from '$lib/constants/app.constants';
	import { governanceSnsesStore } from '$lib/derived/governance.derived';

	export let doc: ProposalMetadataDoc;

	let key: ProposalKey;
	let data: ProposalMetadata;
	let governanceId: ProposalDescription | undefined;

	$: ({ key, data, description: governanceId } = doc);

	let governance: Governance | undefined;
	$: governance = findGovernance({
		governanceId: governanceId ?? GOVERNANCE_CANISTER_ID,
		governanceSnses: $governanceSnsesStore
	});

	let title: string | undefined;
	let nodeProviderName: string | undefined;
	let proposalId: bigint | undefined;

	$: ({ title, nodeProviderName, proposalId } = data);
</script>

<tr>
	<UserProposalLink {key} />
	<GovernanceCell {governance} />
	<ProposalLink id={proposalId} />
	<td class="max-w-lg truncate">{title ?? nodeProviderName ?? ''}</td>
	<UserProposalStatus {proposalId} {governance} />
	<UserProposalView {doc} />
</tr>
