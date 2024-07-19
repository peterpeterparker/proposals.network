<script lang="ts">
	import UserProposalsLoader from '$lib/components/proposals/UserProposalsLoader.svelte';
	import { submitUrl } from '$lib/utils/nav.utils';
	import { governanceIdStore, governanceSnsesStore } from '$lib/derived/governance.derived';
	import type { Governance } from '$lib/types/governance';
	import { findGovernance } from '$lib/utils/governance.utils';
	import { nonNullish } from '@dfinity/utils';

	let governance: Governance | undefined;
	$: governance = findGovernance({
		governanceId: $governanceIdStore,
		governanceSnses: $governanceSnsesStore
	});
</script>

<UserProposalsLoader>
	<div class="flex-col px-4 md:px-0 hidden lg:flex">
		<span class="text-lg font-bold block mb-4">You miss a 100% of the shots you don't take.</span>

		<p class="leading-relaxed mb-4">
			<a class="underline underline-offset-2" href={submitUrl({ governanceId: $governanceIdStore })}
				>Submit</a
			>
			a proposal{nonNullish(governance) ? ` on ${governance.name}` : ''} now!
		</p>
	</div>
</UserProposalsLoader>
