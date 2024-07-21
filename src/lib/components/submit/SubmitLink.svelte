<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { submitUrl } from '$lib/utils/nav.utils';
	import { governanceIdStore } from '$lib/derived/governance.derived';
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import { GOVERNANCE_CANISTER_ID } from '$lib/constants/app.constants';
	import { sortedSnsesStore } from '$lib/derived/sns.derived';
	import GovernanceCell from '$lib/components/core/GovernanceCell.svelte';
	import Img from '$lib/components/ui/Img.svelte';
	import { NNS_GOVERNANCE_METADATA } from '$lib/constants/governance.constants';
	import { nonNullish } from '@dfinity/utils';
	import type { Governance } from '$lib/types/governance';
	import { mapSnsGovernance } from '$lib/utils/governance.utils';

	let visible = false;
	const onClick = () => (visible = true);

	// <a href={submitUrl({ governanceId: $governanceIdStore })}> </a>

	let governances: Governance[];
	$: governances = [
		...(nonNullish(GOVERNANCE_CANISTER_ID)
			? [{ id: GOVERNANCE_CANISTER_ID, ...NNS_GOVERNANCE_METADATA }]
			: []),
		...$sortedSnsesStore.map((sns) =>
			mapSnsGovernance({
				governanceId: sns.canister_ids.governance_canister_id,
				sns
			})
		)
	];
</script>

<Button on:click={onClick}>Submit a proposal</Button>

{#if visible}
	<Dialog on:pnwrkClose={() => (visible = false)}>
		<h2 class="mb-6 text-2xl">For which governance?</h2>

		<div class="grid grid-flow-row gap-4 grid-cols-2">
			{#each governances as governance}
				<span class="inline-flex gap-1 align-middle"
					><Img src={governance.logo} width="24px" />
					<span class=" truncate">{governance.name}</span></span
				>
			{/each}
		</div>
	</Dialog>
{/if}
