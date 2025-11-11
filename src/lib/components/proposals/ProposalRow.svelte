<script lang="ts">
	import type { ProposalId } from '@icp-sdk/canisters/nns';
	import ProposalLink from '$lib/components/proposals/ProposalLink.svelte';
	import ProposalCountdown from '$lib/components/proposals/ProposalCountdown.svelte';
	import ProposalView from '$lib/components/proposals/ProposalView.svelte';
	import ProposalYes from '$lib/components/proposals/ProposalYes.svelte';
	import type { Proposal } from '$lib/types/governance';

	export let proposal: Proposal;

	let id: ProposalId | undefined;
	let type: string | undefined;
	let status: string;
	let deadlineTimestampSeconds: bigint | undefined;
	let title: string | undefined;

	$: ({ id, type, status, deadlineTimestampSeconds, title } = proposal);
</script>

<tr>
	<ProposalLink {id} />
	<td class="truncate">{title ?? ''}</td>
	<td>{type ?? ''}</td>
	<td>{status ?? ''}</td>
	<td><ProposalYes {proposal} /></td>
	<td><ProposalCountdown {deadlineTimestampSeconds} /> </td>
	<ProposalView {id} />
</tr>
