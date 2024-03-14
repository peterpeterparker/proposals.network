<script lang="ts">
	import InputSelect from '$lib/components/ui/InputSelect.svelte';
	import type { ProposalAction } from '$lib/types/governance';
	import { setMetadata } from '$lib/services/idb.services';
	import { isNullish, nonNullish } from '@dfinity/utils';
	import { getContext } from 'svelte';
	import { METADATA_CONTEXT_KEY, type MetadataContext } from '$lib/types/metadata.context';

	let proposalAction: ProposalAction | undefined;

	const { store, reload }: MetadataContext = getContext<MetadataContext>(METADATA_CONTEXT_KEY);

	const init = () => (proposalAction = $store?.metadata?.proposalAction);

	$: $store, init();

	const save = async () => {
		if (isNullish(proposalAction)) {
			return;
		}

		if (proposalAction === $store?.metadata?.proposalAction) {
			return;
		}

		await setMetadata({
			...($store?.metadata ?? {}),
			...(nonNullish(proposalAction) && { proposalAction })
		});

		await reload();
	};

	const proposalOptions = [
		{ value: 'Motion' as ProposalAction, label: 'Motion proposal' },
		{ value: 'AddOrRemoveNodeProvider' as ProposalAction, label: 'Add new node provider proposal' }
	];
</script>

<InputSelect bind:value={proposalAction} on:change={save}>
	{#if isNullish(proposalAction)}
		<option value={undefined}>Select an option...</option>
	{/if}

	{#each proposalOptions as option (option.value)}
		<option value={option.value}>{option.label}</option>
	{/each}
</InputSelect>
