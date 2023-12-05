<script lang="ts">
	import type { ProposalId, ProposalInfo } from '@dfinity/nns';
	import type { Option } from '@dfinity/nns';
	import ProposalLink from '$lib/components/proposals/ProposalLink.svelte';
	import type { Proposal } from '@dfinity/nns';
	import { ProposalRewardStatus, ProposalStatus, Topic } from '@dfinity/nns';
	import en from '$lib/i18n/en.governance.json';
	import { keyOf } from '$lib/utils/utils';

	export let proposalInfo: ProposalInfo;

	let id: Option<ProposalId>;
	let proposal: Option<Proposal>;
	let topic: Topic;
	let status: ProposalStatus;
	let rewardStatus: ProposalRewardStatus;

	$: ({ id, proposal, topic, status, rewardStatus } = proposalInfo);

	let title: string;
	$: title = proposal?.title ?? '';
</script>

<tr>
	<ProposalLink {id} />
	<td class="max-w-lg">{title} </td>
	<td>{keyOf({ obj: en.topics, key: Topic[topic] })}</td>
	<td>{keyOf({ obj: en.rewards, key: ProposalRewardStatus[rewardStatus] })}</td>
	<td>{keyOf({ obj: en.status, key: ProposalStatus[status] })}</td>
	<td></td>
</tr>
