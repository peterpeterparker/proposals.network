<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { submitUrl } from '$lib/utils/nav.utils';
	import type { GovernanceId } from '$lib/types/governance';
	import { goto } from '$app/navigation';
	import GovernanceDialog from '$lib/components/governance/GovernanceDialog.svelte';

	export let color: 'primary' | 'secondary' | 'tertiary' | 'quaternary' = 'primary';

	let visible = false;

	const close = () => (visible = false);
	const navigate = async ({ detail: governanceId }: CustomEvent<GovernanceId>) => {
		close();
		await goto(submitUrl({ governanceId }));
	};
</script>

<Button {color} on:click={() => (visible = true)}>Submit a proposal</Button>

{#if visible}
	<GovernanceDialog on:pnwrkClose={close} on:pnwrkSelect={navigate} />
{/if}
