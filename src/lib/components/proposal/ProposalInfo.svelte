<script lang="ts">
	import { ProposalRewardStatus, ProposalStatus, Topic } from '@dfinity/nns';
	import { PROPOSAL_CONTEXT_KEY, type ProposalContext } from '$lib/types/proposal.context';
	import type { ProposalInfo } from '@dfinity/nns';
	import { getContext } from 'svelte';
	import { isNullish } from '@dfinity/utils';
	import { keyOf } from '$lib/utils/utils';
	import en from '$lib/i18n/en.governance.json';
	import ProposalInfoRow from '$lib/components/proposal/ProposalInfoRow.svelte';
	import { mapProposalType } from '$lib/utils/icp-proposals.utils';
	import Container from '$lib/components/ui/Container.svelte';

	const { store }: ProposalContext<ProposalInfo> =
		getContext<ProposalContext<ProposalInfo>>(PROPOSAL_CONTEXT_KEY);

	let topic: Topic | undefined;
	let status: ProposalStatus | undefined;
	let rewardStatus: ProposalRewardStatus | undefined;

	$: topic = $store?.proposal?.topic;
	$: status = $store?.proposal?.status;
	$: rewardStatus = $store?.proposal?.rewardStatus;

	let type: string | undefined;
	$: ({ type } = mapProposalType($store?.proposal?.proposal));
</script>

<Container>
	<svelte:fragment slot="title">Details</svelte:fragment>

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
</Container>
