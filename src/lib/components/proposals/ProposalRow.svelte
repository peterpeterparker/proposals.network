<script lang="ts">
	import type { ProposalId, ProposalInfo } from '@dfinity/nns';
	import type { Option } from '@dfinity/nns';
	import ProposalLink from '$lib/components/proposals/ProposalLink.svelte';
	import type { Proposal } from '@dfinity/nns';
	import { ProposalRewardStatus, ProposalStatus, Topic } from '@dfinity/nns';
	import en from '$lib/i18n/en.governance.json';
	import { keyOf } from '$lib/utils/utils';
	import ProposalCountdown from '$lib/components/proposals/ProposalCountdown.svelte';
	import ProposalView from '$lib/components/proposals/ProposalView.svelte';
	import ProposalResults from "$lib/components/proposals/ProposalResults.svelte";

	export let proposalInfo: ProposalInfo;

	let id: Option<ProposalId>;
	let proposal: Option<Proposal>;
	let topic: Topic;
	let status: ProposalStatus;
	let rewardStatus: ProposalRewardStatus;
	let deadlineTimestampSeconds: Option<bigint>;

	$: ({ id, proposal, topic, status, rewardStatus, deadlineTimestampSeconds } = proposalInfo);

	let title: string;
	$: title = proposal?.title ?? '';
</script>

<tr>
	<ProposalLink {id} />
	<td class="max-w-lg">{title} sadklmasdklmasdklmasdlkmasdlkmasdlkamsdlkamsdalkmasdlkmasdlkmasdlkams</td>
	<td>{keyOf({ obj: en.topics, key: Topic[topic] })}</td>
	<td>{keyOf({ obj: en.status, key: ProposalStatus[status] })}</td>
	<td><ProposalResults {proposalInfo} /></td>
	<td><ProposalCountdown {deadlineTimestampSeconds} /> </td>
	<ProposalView {id} />
</tr>
