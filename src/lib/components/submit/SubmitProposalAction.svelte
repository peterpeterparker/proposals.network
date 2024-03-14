<script lang="ts">
	import InputSelect from '$lib/components/ui/InputSelect.svelte';
	import type { ProposalAction } from '$lib/types/governance';
	import { setMetadata } from '$lib/services/idb.services';
	import { isNullish, nonNullish } from '@dfinity/utils';
	import { getContext } from 'svelte';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';

	let proposalAction: ProposalAction | undefined;

	const { store, reload }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);

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
		{ value: 'Motion' as ProposalAction, label: 'Motion' },
		{ value: 'AddOrRemoveNodeProvider' as ProposalAction, label: 'Add a new node provider' }
	];
</script>

<InputSelect bind:value={proposalAction} on:change={save}>
	{#if isNullish(proposalAction)}
		<option value={undefined}>Select a type...</option>
	{/if}

	{#each proposalOptions as option (option.value)}
		<option value={option.value}>{option.label}</option>
	{/each}
</InputSelect>
