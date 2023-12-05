<script lang="ts">
	import ButtonCell from '$lib/components/ui/ButtonCell.svelte';
	import type { Option, ProposalId } from '@dfinity/nns';
	import { isNullish } from '@dfinity/utils';
	import { GOVERNANCE_CANISTER_ID } from '$lib/constants/app.constants';

	export let id: Option<ProposalId>;

	let href: string;
	$: href = `/proposal/?g=${GOVERNANCE_CANISTER_ID ?? ''}&id=${id ?? ''}`;
</script>

<td>
	<a class="inline-flex max-w-full gap-1 align-text-top opacity-0 md:opacity-100" {href}>
		<ButtonCell disabled={isNullish(id)}>View</ButtonCell>
	</a>
</td>
