<script lang="ts">
	import { PROPOSAL_CONTEXT_KEY, type ProposalContext } from '$lib/types/proposal.context';
	import { getContext } from 'svelte';
	import ProposalInfoRow from '$lib/components/proposal/ProposalInfoRow.svelte';
	import Container from '$lib/components/ui/Container.svelte';
	import { nonNullish } from '@dfinity/utils';
	import Img from '$lib/components/ui/Img.svelte';
	import { governanceStore } from '$lib/derived/governance.derived';
	import { fade } from 'svelte/transition';

	const { store }: ProposalContext = getContext<ProposalContext>(PROPOSAL_CONTEXT_KEY);

	let topic: string | undefined;
	let status: string | undefined;
	let rewardStatus: string | undefined;
	let type: string | undefined;

	$: topic = $store?.proposal?.topic;
	$: status = $store?.proposal?.status;
	$: rewardStatus = $store?.proposal?.rewardStatus;
	$: type = $store?.proposal?.type;
</script>

<Container>
	<svelte:fragment slot="title">Details</svelte:fragment>

	<ProposalInfoRow>
		Governance
		<svelte:fragment slot="custom-value">
			{#if nonNullish($governanceStore)}
				<span class="inline-flex gap-1" in:fade
					><Img src={$governanceStore?.logo} width="24px" /> {$governanceStore.name}</span
				>
			{/if}
		</svelte:fragment>
	</ProposalInfoRow>

	<ProposalInfoRow value={type}>Type</ProposalInfoRow>

	{#if nonNullish(topic)}
		<ProposalInfoRow value={topic}>Topic</ProposalInfoRow>
	{/if}

	<ProposalInfoRow value={status}>Status</ProposalInfoRow>

	<ProposalInfoRow value={rewardStatus}>Reward Status</ProposalInfoRow>
</Container>
