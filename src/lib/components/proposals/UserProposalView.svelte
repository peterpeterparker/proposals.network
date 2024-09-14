<script lang="ts">
	import ButtonCell from '$lib/components/ui/ButtonCell.svelte';
	import type { ProposalMetadataDoc } from '$lib/types/juno';
	import UserProposalViewLink from '$lib/components/proposals/UserProposalViewLink.svelte';

	export let doc: ProposalMetadataDoc;
</script>

<td>
	<UserProposalViewLink {doc}>
		<ButtonCell>View</ButtonCell>
	</UserProposalViewLink>
</td>
