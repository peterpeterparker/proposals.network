<script lang="ts">
	import SkeletonText from '$lib/components/ui/SkeletonText.svelte';
	import { isNullish, nonNullish } from '@dfinity/utils';
	import { onMount } from 'svelte';
	import { getProposal } from '$lib/api/proposal.api';
	import { ProposalStatus } from '@dfinity/nns';
	import { fade } from 'svelte/transition';

	export let proposalId: bigint | undefined;

	let loading = nonNullish(proposalId);

	let status: string | undefined;

	onMount(async () => {
		if (isNullish(proposalId)) {
			return;
		}

		try {
			const proposal = await getProposal({ proposalId });

			if (isNullish(proposal)) {
				return;
			}

			status = ProposalStatus[proposal.status];
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
