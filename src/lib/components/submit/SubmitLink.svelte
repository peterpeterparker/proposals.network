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
	import type { Governance, GovernanceId } from '$lib/types/governance';
	import { mapSnsGovernance } from '$lib/utils/governance.utils';
	import { goto } from '$app/navigation';

	let visible = false;
	const onClick = () => (visible = true);

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

	const navigate = async (governanceId: GovernanceId) => await goto(submitUrl({ governanceId }));
</script>

<Button on:click={onClick}>Submit a proposal</Button>

{#if visible}
	<Dialog wide on:pnwrkClose={() => (visible = false)}>
		<h2 class="mb-6 text-2xl">For which governance?</h2>

		<div class="grid grid-flow-row gap-4 grid-cols-3">
			{#each governances as governance}
				<button
					on:click={() => navigate(governance.id)}
					class="inline-flex gap-1 align-middle border-black border-2 py-1 px-2.5 lg:rounded-md hover:bg-[#79F7FF] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-[#00E1EF]"
				>
					<Img src={governance.logo} width="24px" />
					<span class=" truncate">{governance.name}</span>
				</button>
			{/each}
		</div>
	</Dialog>
{/if}
