<script lang="ts">
	import ButtonCell from '$lib/components/ui/ButtonCell.svelte';
	import { userProposalUrl } from '$lib/utils/nav.utils';
	import type { ProposalDescription, ProposalMetadataDoc } from '$lib/types/juno';

	export let doc: ProposalMetadataDoc;

	let key: string;
	let governanceId: ProposalDescription | undefined;
	$: ({ key, description: governanceId } = doc);

	let href: string;
	$: href = userProposalUrl({ key, governanceId: governanceId });
</script>

<td>
	<a class="inline-flex max-w-full gap-1 align-text-top" {href}>
		<ButtonCell>View</ButtonCell>
	</a>
</td>
