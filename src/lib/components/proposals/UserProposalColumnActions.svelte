<script lang="ts">
	import ButtonCell from '$lib/components/ui/ButtonCell.svelte';
	import type { ProposalMetadataDoc } from '$lib/types/juno';
	import { emit } from '$lib/utils/events.utils';

	export let doc: ProposalMetadataDoc;

	let button: HTMLButtonElement;

	const onClick = () => emit({ message: 'pnwrkOpenUserProposalActions', detail: { doc, button } });
</script>

<td>
	<button bind:this={button} class="inline-flex max-w-full gap-1 align-text-top" on:click={onClick}>
		<ButtonCell>Actions</ButtonCell>
	</button>
</td>
