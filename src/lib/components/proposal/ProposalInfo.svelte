<script lang="ts">
	import {
		type Option,
		type ProposalId,
		type NeuronId,
		ProposalRewardStatus,
		ProposalStatus,
		Topic
	} from '@dfinity/nns';
	import { PROPOSAL_CONTEXT_KEY, type ProposalContext } from '$lib/types/proposal.context';
	import type { ProposalInfo } from '@dfinity/nns';
	import { getContext } from 'svelte';
	import { isNullish } from '@dfinity/utils';
	import { keyOf } from '$lib/utils/utils';
	import en from '$lib/i18n/en.governance.json';
	import ProposalInfoRow from '$lib/components/proposal/ProposalInfoRow.svelte';
	import { mapProposalType } from '$lib/utils/proposals.utils';
	import { secondsToDateTime } from '$lib/utils/date.utils';

	const { store }: ProposalContext<ProposalInfo> =
		getContext<ProposalContext<ProposalInfo>>(PROPOSAL_CONTEXT_KEY);

	let id: Option<ProposalId>;
	let topic: Topic | undefined;
	let status: ProposalStatus | undefined;
	let rewardStatus: ProposalRewardStatus | undefined;
	let proposalTimestampSeconds: Option<bigint>;
	let proposer: Option<NeuronId>;

	$: id = $store?.proposal?.id;
	$: topic = $store?.proposal?.topic;
	$: status = $store?.proposal?.status;
	$: rewardStatus = $store?.proposal?.rewardStatus;
	$: proposalTimestampSeconds = $store?.proposal?.proposalTimestampSeconds;
	$: proposer = $store?.proposal?.proposer;

	let type: string | undefined;
	$: ({ type } = mapProposalType($store?.proposal?.proposal));
</script>

<div
	class="bg-white border-2 border-black lg:rounded-md overflow-hidden h-full mb-16 md:mb-0 lg:mb-16 xl:mb-0"
>
	<aside class="border-b-2 border-black bg-violet-200 p-2">Proposal Details</aside>

	<ProposalInfoRow value={id}>ID</ProposalInfoRow>

	<ProposalInfoRow value={type}>Type</ProposalInfoRow>

	<ProposalInfoRow
		value={isNullish(topic) ? undefined : keyOf({ obj: en.topics, key: Topic[topic] })}
	>
		Topic
	</ProposalInfoRow>

	<ProposalInfoRow
		value={isNullish(status) ? undefined : keyOf({ obj: en.status, key: ProposalStatus[status] })}
	>
		Status
	</ProposalInfoRow>

	<ProposalInfoRow
		value={isNullish(rewardStatus)
			? undefined
			: keyOf({ obj: en.rewards, key: ProposalRewardStatus[rewardStatus] })}
	>
		Reward Status
	</ProposalInfoRow>

	<ProposalInfoRow
		value={isNullish(proposalTimestampSeconds)
			? undefined
			: secondsToDateTime(proposalTimestampSeconds)}
	>
		Created
	</ProposalInfoRow>

	<ProposalInfoRow value={proposer}>Proposer</ProposalInfoRow>
</div>
