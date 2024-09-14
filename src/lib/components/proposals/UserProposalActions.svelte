<script lang="ts">
	import Popover from '$lib/components/ui/Popover.svelte';
	import type { ProposalMetadataDoc } from '$lib/types/juno';
	import { nonNullish } from '@dfinity/utils';
	import IconView from '$lib/components/icons/IconView.svelte';
	import IconDelete from '$lib/components/icons/IconDelete.svelte';
	import UserProposalViewLink from '$lib/components/proposals/UserProposalViewLink.svelte';
	import UserProposalDeleteDialog from '$lib/components/proposals/UserProposalDeleteDialog.svelte';
	import { deleteProposal } from '$lib/services/user-proposal.services';
	import { governanceIdStore } from '$lib/derived/governance.derived';

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
</script>

<svelte:window on:pnwrkOpenUserProposalActions={onOpen} />

{#if nonNullish(button) && nonNullish(doc)}
	<Popover bind:visible anchor={button} direction="rtl">
		<UserProposalViewLink {doc} on:click={close}>
			<IconView size="20" /> View
		</UserProposalViewLink>

		{#if doc.data.status === 'draft'}
			<button class="flex gap-2 items-center mt-2" on:click={onDelete}>
				<IconDelete size="20" /> Delete
			</button>
		{/if}
	</Popover>
{/if}

{#if visibleDelete && nonNullish(doc)}
	<UserProposalDeleteDialog {doc} on:pnwrkClose={close} on:pnwrkDelete={doDelete} />
{/if}
