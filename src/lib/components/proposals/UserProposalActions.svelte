<script lang="ts">
	import Popover from '$lib/components/ui/Popover.svelte';
	import type { ProposalMetadataDoc } from '$lib/types/juno';
	import { nonNullish } from '@dfinity/utils';
	import UserProposalActionsList from '$lib/components/proposals/UserProposalActionsList.svelte';
	import UserProposalDeleteDialog from '$lib/components/proposals/UserProposalDeleteDialog.svelte';
	import { deleteProposal } from '$lib/services/user-proposal.services';
	import { governanceIdStore } from '$lib/derived/governance.derived';
	import Dialog from '$lib/components/ui/Dialog.svelte';

	let visible = false;
	let visibleDelete = false;

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
		visibleDelete = false;
		button = undefined;
		doc = undefined;
	};

	const onDelete = () => {
		visible = false;
		visibleDelete = true;
	};

	const doDelete = async () => {
		const { result } = await deleteProposal({
			doc,
			governanceId: $governanceIdStore
		});

		if (result !== 'ok') {
			return;
		}

		close();
	};

	let innerWidth: number | undefined = undefined;
</script>

<svelte:window on:pnwrkOpenUserProposalActions={onOpen} bind:innerWidth on:resize={close} />

{#if nonNullish(button) && nonNullish(doc)}
	{#if (innerWidth ?? 0) > 1024}
		<Popover bind:visible anchor={button} direction="rtl">
			<UserProposalActionsList {doc} on:pnwrkDelete={onDelete} />
		</Popover>
	{:else}
		<Dialog on:pnwrkClose>
			<UserProposalActionsList {doc} on:pnwrkDelete={onDelete} />
		</Dialog>
	{/if}
{/if}

{#if visibleDelete && nonNullish(doc)}
	<UserProposalDeleteDialog {doc} on:pnwrkClose={close} on:pnwrkDelete={doDelete} />
{/if}
