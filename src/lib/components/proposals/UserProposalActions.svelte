<script lang="ts">
	import { signIn } from '$lib/services/auth.services.js';
	import Popover from '$lib/components/ui/Popover.svelte';
	import type { ProposalMetadataDoc } from '$lib/types/juno';
	import { nonNullish } from '@dfinity/utils';
	import IconView from '$lib/components/icons/IconView.svelte';
	import IconDelete from '$lib/components/icons/IconDelete.svelte';
	import ButtonCell from '$lib/components/ui/ButtonCell.svelte';
	import UserProposalViewLink from '$lib/components/proposals/UserProposalViewLink.svelte';

	let visible = false;

	let button: HTMLButtonElement | undefined;
	let doc: ProposalMetadataDoc | undefined;

	const onOpen = ({
		detail
	}: CustomEvent<{ doc: ProposalMetadataDoc; button: HTMLButtonElement }>) => {
		doc = detail.doc;
		button = detail.button;
		visible = true;
	};

	const close = () => {
		visible = false;
		button = undefined;
		doc = undefined;
	};
</script>

<svelte:window on:pnwrkOpenUserProposalActions={onOpen} />

{#if nonNullish(button) && nonNullish(doc)}
	<Popover bind:visible anchor={button} direction="rtl">
		<UserProposalViewLink {doc} on:click={close}>
			<IconView size="20" /> View
		</UserProposalViewLink>

		<button class="flex gap-2 items-center mt-2" on:click={async () => await signIn('ic0.app')}>
			<IconDelete size="20" /> Delete
		</button>
	</Popover>
{/if}
