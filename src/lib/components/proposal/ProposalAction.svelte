<script lang="ts">
	import { PROPOSAL_CONTEXT_KEY, type ProposalContext } from '$lib/types/proposal.context';
	import type { Option, Proposal, ProposalInfo } from '@dfinity/nns';
	import { getContext } from 'svelte';
	import { proposalActionData, proposalFirstActionKey } from '$lib/utils/proposals.utils';
	import { isNullish, nonNullish } from '@dfinity/utils';
	import { fade } from 'svelte/transition';
	import Container from '$lib/components/ui/Container.svelte';
	import Json from '$lib/components/ui/Json.svelte';
	import { expandObject } from '$lib/utils/json.utils';

	const { store }: ProposalContext<ProposalInfo> =
		getContext<ProposalContext<ProposalInfo>>(PROPOSAL_CONTEXT_KEY);

	let proposal: Option<Proposal>;
	$: proposal = $store?.proposal?.proposal;

	let actionKey: string | undefined;
	let actionData: unknown = {};

	$: actionKey = proposal !== undefined ? proposalFirstActionKey(proposal) : undefined;
	$: actionData = proposal !== undefined ? proposalActionData(proposal) : {};

	let json: unknown;
	$: json = isNullish(actionData)
		? actionData
		: expandObject(actionData as Record<string, unknown>);
</script>

{#if nonNullish(actionKey) && nonNullish(actionData)}
	<div in:fade class="col-span-2">
		<Container color="quaternary">
			<svelte:fragment slot="title">{actionKey}</svelte:fragment>
			<div class="py-3 px-2">
				<Json {json} />
			</div>
		</Container>
	</div>
{/if}
