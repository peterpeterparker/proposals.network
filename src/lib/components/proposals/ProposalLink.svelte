<script lang="ts">
	import IconLink from '$lib/components/icons/IconLink.svelte';
	import type { Option } from '@dfinity/nns';
	import type { ProposalId } from '@dfinity/nns';
	import { nonNullish } from '@dfinity/utils';

	export let id: Option<ProposalId>;

	let href: string;
	$: href = `/proposal/?id=${id ?? ''}`;
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
