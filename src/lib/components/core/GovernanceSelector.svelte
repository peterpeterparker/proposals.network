<script lang="ts">
	import InputSelect from '$lib/components/ui/InputSelect.svelte';
	import Img from '$lib/components/ui/Img.svelte';
	import { GOVERNANCE_CANISTER_ID } from '$lib/constants/app.constants';
	import { nonNullish } from '@dfinity/utils';
	import { sortedSnsesStore } from '$lib/derived/sns.derived';
	import { governanceIdStore, governanceStore } from '$lib/derived/governance.derived';
	import { switchGovernance } from '$lib/utils/nav.utils';

	let governanceId = $governanceIdStore;

	let logoSrc: string;
	$: logoSrc = $governanceStore?.logo ?? 'logo/icp.svg';

	const onChange = async () => await switchGovernance(governanceId);
</script>

<InputSelect bind:value={governanceId} on:change={onChange}>
	{#if nonNullish(GOVERNANCE_CANISTER_ID)}
		<option value={GOVERNANCE_CANISTER_ID}>Internet Computer</option>
	{/if}

	{#each $sortedSnsesStore as sns}
		<option value={sns.canister_ids.governance_canister_id}>{sns.meta.name ?? ''}</option>
	{/each}

	<Img src={logoSrc} width="48px" slot="logo" />
</InputSelect>
