<script lang="ts">
	import { PROPOSAL_CONTEXT_KEY, type ProposalContext } from '$lib/types/proposal.context';
	import { getContext } from 'svelte';
	import { isNullish, nonNullish } from '@dfinity/utils';
	import { fade } from 'svelte/transition';
	import Container from '$lib/components/ui/Container.svelte';
	import Json from '$lib/components/ui/Json.svelte';
	import { expandObject } from '$lib/utils/json.utils';

	const { store }: ProposalContext = getContext<ProposalContext>(PROPOSAL_CONTEXT_KEY);

	let actionKey: string | undefined;
	let actionData: unknown;

	$: actionKey = $store?.proposal?.action?.key;
	$: actionData = $store?.proposal?.action?.data ?? {};

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
