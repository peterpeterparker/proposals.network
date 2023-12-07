<script lang="ts">
	import type { Option, NeuronId, Proposal } from '@dfinity/nns';
	import { PROPOSAL_CONTEXT_KEY, type ProposalContext } from '$lib/types/proposal.context';
	import type { ProposalInfo } from '@dfinity/nns';
	import { getContext } from 'svelte';
	import { nonNullish } from '@dfinity/utils';
	import ProposalInfoRow from '$lib/components/proposal/ProposalInfoRow.svelte';
	import { fade } from 'svelte/transition';
	import ExternalLink from '$lib/components/ui/ExternalLink.svelte';
	import Container from '$lib/components/ui/Container.svelte';

	const { store }: ProposalContext<ProposalInfo> =
		getContext<ProposalContext<ProposalInfo>>(PROPOSAL_CONTEXT_KEY);

	let proposer: Option<NeuronId>;
	let proposal: Option<Proposal>;

	$: proposer = $store?.proposal?.proposer;
	$: proposal = $store?.proposal?.proposal;

	let url: string | undefined;
	$: url = proposal?.url;
</script>

<Container color="secondary">
	<svelte:fragment slot="title">Links</svelte:fragment>

	<ProposalInfoRow>
		Proposer
		<svelte:fragment slot="custom-value">
			{#if nonNullish(proposer)}
				<div in:fade class="inline-block truncate max-w-[60%]">
					<ExternalLink
						underline="hover"
						href={`https://dashboard.internetcomputer.org/neuron/${proposer}`}
						ariaLabel="Open proposer on the ICP dashboard">{proposer}</ExternalLink
					>
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
</Container>
