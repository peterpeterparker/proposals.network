<script lang="ts">
	import { userProposalUrl } from '$lib/utils/nav.utils';
	import type { ProposalDescription, ProposalMetadataDoc } from '$lib/types/juno';

	export let doc: ProposalMetadataDoc;

	let key: string;
	let governanceId: ProposalDescription | undefined;
	$: ({ key, description: governanceId } = doc);

	let href: string;
	$: href = userProposalUrl({ key, governanceId: governanceId });
</script>

<a class="inline-flex max-w-full gap-2" {href} on:click>
	<slot />
</a>
