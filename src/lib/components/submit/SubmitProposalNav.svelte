<script lang="ts">
	import { isNullish } from '@dfinity/utils';
	import { GOVERNANCE_CANISTER_ID } from '$lib/constants/app.constants';

	export let proposalId: bigint | undefined;
</script>

<p class="leading-relaxed mb-4">
	{#if isNullish(proposalId)}
		Return to the <a href="/" class="underline underline-offset-8">home page</a>.
	{:else}
		You can either return to the <a href="/" class="underline underline-offset-8">home page</a> or
		<a
			href={`/proposal/?g=${GOVERNANCE_CANISTER_ID ?? ''}&id=${proposalId}`}
			class="underline underline-offset-8">open</a
		>
		the proposal you've just submitted.
	{/if}
</p>
