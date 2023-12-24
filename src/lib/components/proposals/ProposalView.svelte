<script lang="ts">
	import ButtonCell from '$lib/components/ui/ButtonCell.svelte';
	import type { Option, ProposalId } from '@dfinity/nns';
	import { isNullish } from '@dfinity/utils';
	import { proposalUrl } from '$lib/utils/nav.utils';

	export let id: Option<ProposalId>;

	let href: string;
	$: href = proposalUrl(id ?? '');
</script>

<td>
	<a class="inline-flex max-w-full gap-1 align-text-top opacity-0 md:opacity-100" {href}>
		<ButtonCell disabled={isNullish(id)}>View</ButtonCell>
	</a>
</td>
