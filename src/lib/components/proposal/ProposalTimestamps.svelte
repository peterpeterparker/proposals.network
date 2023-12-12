<script lang="ts">
	import { PROPOSAL_CONTEXT_KEY, type ProposalContext } from '$lib/types/proposal.context';
	import { getContext } from 'svelte';
	import { isNullish, nonNullish } from '@dfinity/utils';
	import ProposalInfoRow from '$lib/components/proposal/ProposalInfoRow.svelte';
	import { secondsToDateTime } from '$lib/utils/date.utils';
	import Container from '$lib/components/ui/Container.svelte';

	const { store }: ProposalContext =
		getContext<ProposalContext>(PROPOSAL_CONTEXT_KEY);

	let proposalTimestampSeconds: bigint | undefined;
	let decidedTimestampSeconds: bigint | undefined;
	let executedTimestampSeconds: bigint | undefined;
	let failedTimestampSeconds: bigint | undefined;

	$: proposalTimestampSeconds = $store?.proposal?.proposalTimestampSeconds;
	$: decidedTimestampSeconds = $store?.proposal?.decidedTimestampSeconds;
	$: executedTimestampSeconds = $store?.proposal?.executedTimestampSeconds;
	$: failedTimestampSeconds = $store?.proposal?.failedTimestampSeconds;
</script>

<Container color="quaternary">
	<svelte:fragment slot="title">Timestamps</svelte:fragment>

	<ProposalInfoRow
		value={isNullish(proposalTimestampSeconds)
			? undefined
			: secondsToDateTime(proposalTimestampSeconds)}
	>
		Created
	</ProposalInfoRow>

	{#if nonNullish(decidedTimestampSeconds) && decidedTimestampSeconds > 0n}
		<ProposalInfoRow value={secondsToDateTime(decidedTimestampSeconds)}>Decided</ProposalInfoRow>
	{/if}

	{#if nonNullish(executedTimestampSeconds) && executedTimestampSeconds > 0n}
		<ProposalInfoRow value={secondsToDateTime(executedTimestampSeconds)}>Executed</ProposalInfoRow>
	{/if}

	{#if nonNullish(failedTimestampSeconds) && failedTimestampSeconds > 0n}
		<ProposalInfoRow value={secondsToDateTime(failedTimestampSeconds)}>Failed</ProposalInfoRow>
	{/if}
</Container>
