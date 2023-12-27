<script lang="ts">
	import { isNullish, nonNullish } from '@dfinity/utils';
	import { proposalUrl } from '$lib/utils/nav.utils';
	import { governanceIdStore } from '$lib/derived/governance.derived';

	export let proposalId: bigint | undefined;

	let href: string;
	$: href = nonNullish(proposalId)
		? proposalUrl({ id: proposalId, governanceId: $governanceIdStore })
		: '';
</script>

<p class="leading-relaxed mb-4">
	{#if isNullish(proposalId)}
		Return to the <a href="/" class="underline underline-offset-8">home page</a>.
	{:else}
		You can either return to the <a href="/" class="underline underline-offset-8">home page</a> or
		<a {href} class="underline underline-offset-8">open</a>
		the proposal you've just submitted.
	{/if}
</p>
