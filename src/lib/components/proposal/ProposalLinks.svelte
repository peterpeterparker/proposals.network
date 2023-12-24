<script lang="ts">
	import { PROPOSAL_CONTEXT_KEY, type ProposalContext } from '$lib/types/proposal.context';
	import { getContext } from 'svelte';
	import { nonNullish } from '@dfinity/utils';
	import ProposalInfoRow from '$lib/components/proposal/ProposalInfoRow.svelte';
	import { fade } from 'svelte/transition';
	import ExternalLink from '$lib/components/ui/ExternalLink.svelte';
	import Container from '$lib/components/ui/Container.svelte';
	import ProposalVoteUrl from '$lib/components/proposal/ProposalVoteUrl.svelte';
	import IconArrowOutward from '$lib/components/icons/IconArrowOutward.svelte';

	const { store }: ProposalContext = getContext<ProposalContext>(PROPOSAL_CONTEXT_KEY);

	let proposerId: string | bigint | undefined;
	let proposerUrl: string | bigint | undefined;
	let url: string | undefined;
	let id: bigint | undefined;

	$: proposerId = $store?.proposal?.proposer?.id;
	$: proposerUrl = $store?.proposal?.proposer?.url;
	$: url = $store?.proposal?.url;
	$: id = $store?.proposal?.id;
</script>

<Container color="secondary">
	<svelte:fragment slot="title">Links</svelte:fragment>

	<ProposalInfoRow>
		Proposer
		<svelte:fragment slot="custom-value">
			{#if nonNullish(proposerId)}
				<div in:fade class="inline-block truncate max-w-[60%]">
					{#if proposerUrl !== undefined && proposerUrl !== null}
						<ExternalLink
							underline="hover"
							href={`${proposerUrl}`}
							ariaLabel="Open proposer on the ICP dashboard">{proposerId}</ExternalLink
						>
					{:else}
						<span>{proposerId}</span>
					{/if}
				</div>
			{/if}
		</svelte:fragment>
	</ProposalInfoRow>

	{#if nonNullish(url) && url !== ''}
		<div in:fade>
			<ProposalInfoRow>
				URL
				<svelte:fragment slot="custom-value">
					<div class="max-w-[60%]">
						<ExternalLink underline="hover" href={url} ariaLabel="URL linked to the proposal"
							>{url}</ExternalLink
						>
					</div>
				</svelte:fragment>
			</ProposalInfoRow>
		</div>
	{/if}

	{#if nonNullish(id)}
		<ProposalInfoRow>
			Vote
			<ProposalVoteUrl slot="custom-value" {id}>
				<span class="inline-flex gap-1.5 items-center hover:underline"
					>NNS dapp / {id} <IconArrowOutward /></span
				>
			</ProposalVoteUrl>
		</ProposalInfoRow>
	{/if}
</Container>
