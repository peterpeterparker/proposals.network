<script lang="ts">
	import SkeletonText from '$lib/components/ui/SkeletonText.svelte';
	import { isNullish, nonNullish } from '@dfinity/utils';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { getProposal } from '$lib/services/proposal.services';
	import { governanceTypeStore } from '$lib/derived/governance.derived';
	import type { Governance } from '$lib/types/governance';

	export let governance: Governance | undefined;
	export let proposalId: bigint | undefined;

	let loading = nonNullish(proposalId) && nonNullish(governance);

	let status: string | undefined;

	onMount(async () => {
		if (isNullish(proposalId) || isNullish(governance)) {
			return;
		}

		try {
			const proposal = await getProposal({
				proposalId,
				governanceId: governance.id,
				type: $governanceTypeStore
			});

			console.log(proposal);

			if (isNullish(proposal)) {
				return;
			}

			status = proposal.status;
		} catch (err: unknown) {
			console.error(err);
		} finally {
			loading = false;
		}
	});
</script>

<td>
	{#if loading}
		<SkeletonText />
	{:else if nonNullish(status)}
		<span in:fade>{status}</span>
	{/if}
</td>
