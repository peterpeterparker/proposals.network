<script lang="ts">
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import Img from '$lib/components/ui/Img.svelte';
	import type { Governance, GovernanceId } from '$lib/types/governance';
	import { nonNullish } from '@dfinity/utils';
	import { GOVERNANCE_CANISTER_ID } from '$lib/constants/app.constants';
	import { NNS_GOVERNANCE_METADATA } from '$lib/constants/governance.constants';
	import { sortedSnsesStore } from '$lib/derived/sns.derived';
	import { mapSnsGovernance } from '$lib/utils/governance.utils';
	import { submitUrl, switchGovernance } from '$lib/utils/nav.utils';
	import { goto } from '$app/navigation';

	let visible = false;
	$: visible = nonNullish(action);

	let action: undefined | null | 'select' | 'select_and_navigate';

	const onOpen = ({ detail }: CustomEvent<{ navigate?: boolean }>) =>
		(action = detail?.navigate ? 'select_and_navigate' : 'select');
	const close = () => (action = null);

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

	const onSelectGovernance = async (governanceId: GovernanceId) => {
		await switchGovernance(governanceId);

		if (action === 'select_and_navigate') {
			await goto(submitUrl({ governanceId }));
		}

		close();
	};
</script>

<svelte:window on:pnwrkOpenGovernance={onOpen} />

{#if visible}
	<Dialog wide on:pnwrkClose={close}>
		<h2 class="mb-6 text-2xl">Which governance?</h2>

		<div class="grid grid-flow-row gap-4 grid-cols-3">
			{#each governances as governance (governance.id)}
				<button
					on:click={() => onSelectGovernance(governance.id)}
					class="inline-flex justify-center sm:justify-start gap-1 align-middle border-black border-2 py-1 px-2.5 lg:rounded-md hover:bg-[#79F7FF] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-[#00E1EF]"
				>
					<Img src={governance.logo} width="24px" />
					<span class=" truncate hidden sm:block">{governance.name}</span>
				</button>
			{/each}
		</div>
	</Dialog>
{/if}
