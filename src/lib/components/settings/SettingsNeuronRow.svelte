<script lang="ts">
	import type { GovernanceCanisterId } from '$lib/types/core';
	import type { Governance } from '$lib/types/governance';
	import { findGovernance } from '$lib/utils/governance.utils';
	import { governanceSnsesStore } from '$lib/derived/governance.derived';
	import GovernanceCell from '$lib/components/core/GovernanceCell.svelte';
    import ButtonCell from "$lib/components/ui/ButtonCell.svelte";

	export let neuron: [GovernanceCanisterId, (string | bigint)[]];

	let governanceId: GovernanceCanisterId;
	let neuronId: string | bigint | undefined;

	$: governanceId = neuron[0];
	$: neuronId = neuron[1][0];

	let governance: Governance | undefined;
	$: governance = findGovernance({
		governanceId,
		governanceSnses: $governanceSnsesStore
	});
</script>

<tr>
    <GovernanceCell {governance} />
    <td>{neuronId ?? ''}</td>
    <td>
        <ButtonCell>Delete</ButtonCell>
    </td>
</tr>
