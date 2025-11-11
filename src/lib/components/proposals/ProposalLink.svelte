<script lang="ts">
	import IconLink from '$lib/components/icons/IconLink.svelte';
	import type { Option } from '@icp-sdk/canisters/nns';
	import type { ProposalId } from '@icp-sdk/canisters/nns';
	import { nonNullish } from '@dfinity/utils';
	import { proposalUrl } from '$lib/utils/nav.utils';
	import { governanceIdStore } from '$lib/derived/governance.derived';

	export let id: Option<ProposalId>;

	let href: string;
	$: href = proposalUrl({ id: `${id ?? ''}`, governanceId: $governanceIdStore });
</script>

<td>
	{#if nonNullish(id)}
		<a class="inline-flex max-w-full gap-1 align-text-top" {href}>
			<IconLink />
			<span>{id}</span>
		</a>
	{/if}
</td>

<style lang="scss">
	td {
		max-width: 160px;
	}
</style>
