<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import type { ProposalAction } from '$lib/types/governance';

	export let proposalAction: ProposalAction | undefined;
</script>

<Button color="tertiary" disabled={!proposalAction} on:click>Continue</Button>
