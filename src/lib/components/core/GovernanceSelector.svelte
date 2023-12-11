<script lang="ts">
	import InputSelect from '$lib/components/ui/InputSelect.svelte';
	import Img from '$lib/components/ui/Img.svelte';
	import { GOVERNANCE_CANISTER_ID } from '$lib/constants/app.constants';
	import { nonNullish } from '@dfinity/utils';
	import { snsesStore } from '$lib/stores/snses.store';

	let governanceId: string | undefined = GOVERNANCE_CANISTER_ID;

	let logoSrc: string;
	$: logoSrc =
		nonNullish(governanceId) &&
		nonNullish(GOVERNANCE_CANISTER_ID) &&
		governanceId !== GOVERNANCE_CANISTER_ID
			? `logo/snses/${governanceId}.png`
			: 'logo/icp.svg';
</script>

<InputSelect bind:value={governanceId}>
	{#if nonNullish(GOVERNANCE_CANISTER_ID)}
		<option value={GOVERNANCE_CANISTER_ID}>Internet Computer</option>
	{/if}

	{#each $snsesStore as sns}
		<option value={sns.canister_ids.governance_canister_id}>{sns.meta.name ?? ''}</option>
	{/each}

	<Img src={logoSrc} width="100%" slot="logo" />
</InputSelect>
