<script lang="ts">
	import { submitUrl } from '$lib/utils/nav.utils';
	import type { GovernanceId } from '$lib/types/governance';
	import { goto } from '$app/navigation';
	import GovernanceDialog from '$lib/components/governance/GovernanceDialog.svelte';

	let visible = false;

	const close = () => (visible = false);
	const navigate = async ({ detail: governanceId }: CustomEvent<GovernanceId>) => {
		close();
		await goto(submitUrl({ governanceId }));
	};
</script>

<button class="hover:underline hover:underline-offset-8 mb-4 text-left" on:click={() => (visible = true)}>Submit a proposal</button>

{#if visible}
	<GovernanceDialog on:pnwrkClose={close} on:pnwrkSelect={navigate} />
{/if}
