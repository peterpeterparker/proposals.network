<script lang="ts">
	import IconLink from '$lib/components/icons/IconLink.svelte';
	import { userProposalUrl } from '$lib/utils/nav.utils';
	import { governanceIdStore } from '$lib/derived/governance.derived';

	export let key: string;

	let href: string;
	$: href = userProposalUrl({ key, governanceId: $governanceIdStore });
</script>

<td>
	<a class="inline-flex max-w-full gap-1 align-text-top" {href}>
		<IconLink />
		<span>{key}</span>
	</a>
</td>

<style lang="scss">
	td {
		max-width: 160px;
	}
</style>
