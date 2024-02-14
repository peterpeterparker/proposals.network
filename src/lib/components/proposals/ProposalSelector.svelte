<script lang="ts">
	import InputSelect from '$lib/components/ui/InputSelect.svelte';
	import type { ProposalAction } from '$lib/types/governance';

	export let proposalAction: ProposalAction | undefined;

	// TODO: User should not be able to select the undefined value, but should be visible if no value selected.
	const proposalOptions = [
		{ value: undefined, label: 'Select an option...' },
		{ value: 'Motion' as ProposalAction, label: 'Motion proposal' },
		{ value: 'AddOrRemoveNodeProvider' as ProposalAction, label: 'Add new node provider proposal' }
	];
</script>

<InputSelect bind:value={proposalAction}>
	{#each proposalOptions as option (option.value)}
		<option value={option.value}>{option.label}</option>
	{/each}
</InputSelect>
