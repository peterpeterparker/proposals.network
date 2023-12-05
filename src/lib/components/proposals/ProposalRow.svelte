<script lang="ts">
	import type { ProposalId, ProposalInfo } from '@dfinity/nns';
	import type { Option } from '@dfinity/nns';
	import ProposalLink from '$lib/components/proposals/ProposalLink.svelte';
	import type { Proposal } from '@dfinity/nns';
	import { ProposalRewardStatus, ProposalStatus, Topic } from '@dfinity/nns';
	import en from '$lib/i18n/en.governance.json';

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
	<td>{en.topics[Topic[topic]]}</td>
	<td>{en.rewards[ProposalRewardStatus[rewardStatus]]}</td>
	<td>{en.status[ProposalStatus[status]]}</td>
	<td></td>
</tr>
