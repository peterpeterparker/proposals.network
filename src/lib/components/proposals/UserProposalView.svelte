<script lang="ts">
	import ButtonCell from '$lib/components/ui/ButtonCell.svelte';
	import { userProposalUrl } from '$lib/utils/nav.utils';
	import { governanceIdStore } from '$lib/derived/governance.derived';

	export let key: string;

	let href: string;
	$: href = userProposalUrl({ key, governanceId: $governanceIdStore });
</script>

<td>
	<a class="inline-flex max-w-full gap-1 align-text-top" {href}>
		<ButtonCell>View</ButtonCell>
	</a>
</td>
