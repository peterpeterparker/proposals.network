<script lang="ts">
	import type { ProposalDescription, ProposalMetadataDoc } from '$lib/types/juno';
	import { governanceSnsesStore } from '$lib/derived/governance.derived';
	import { fade } from 'svelte/transition';
	import Img from '$lib/components/ui/Img.svelte';
	import type { Governance } from '$lib/types/governance';
	import { findGovernance } from '$lib/utils/governance.utils';
	import { nonNullish } from '@dfinity/utils';
	import { GOVERNANCE_CANISTER_ID } from '$lib/constants/app.constants';

	export let doc: ProposalMetadataDoc;

	let governanceId: ProposalDescription | undefined;
	$: ({ description: governanceId } = doc);

	let governance: Governance | undefined;
	$: governance = findGovernance({
		governanceId: governanceId ?? GOVERNANCE_CANISTER_ID,
		governanceSnses: $governanceSnsesStore
	});
</script>

<td>
	{#if nonNullish(governance)}
		<span class="inline-flex gap-1" in:fade
			><Img src={governance?.logo} width="24px" />
			<span class=" truncate">{governance.name}</span></span
		>
	{/if}
</td>
