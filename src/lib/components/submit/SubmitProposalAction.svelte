<script lang="ts">
	import InputSelect from '$lib/components/ui/InputSelect.svelte';
	import type { ProposalAction } from '$lib/types/governance';
	import { setMetadata } from '$lib/services/idb.services';
	import { isNullish, nonNullish } from '@dfinity/utils';
	import { getContext } from 'svelte';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import { page } from '$app/stores';
	import { governanceTypeStore } from '$lib/derived/governance.derived';

	let proposalAction: ProposalAction | undefined;

	const { store, reload }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);

	const initWithQueryParam = async () => {
		const action = $page.url.searchParams.get('action');

		if (isNullish(action)) {
			return;
		}

		proposalAction =
			$governanceTypeStore === 'icp'
				? action?.toLowerCase() === 'Motion'.toLowerCase()
					? 'Motion'
					: action?.toLowerCase() === 'AddOrRemoveNodeProvider'.toLowerCase()
						? 'AddOrRemoveNodeProvider'
						: action?.toLowerCase() === 'CreateServiceNervousSystem'.toLowerCase()
							? 'CreateServiceNervousSystem'
							: undefined
				: action?.toLowerCase() === 'Motion'.toLowerCase()
					? 'Motion'
					: action?.toLowerCase() === 'TransferSnsTreasuryFunds'.toLowerCase()
						? 'TransferSnsTreasuryFunds'
						: undefined;

		if (isNullish(proposalAction)) {
			return;
		}

		await save();
	};

	const init = async () => {
		proposalAction = $store?.metadata?.proposalAction;

		if (nonNullish(proposalAction)) {
			return;
		}

		await initWithQueryParam();
	};

	$: ($store, (async () => await init())());

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

	type ProposalOptions = { value: ProposalAction; label: string }[];

	const proposalOptionsNns: ProposalOptions = [
		{ value: 'Motion', label: 'Motion' },
		{ value: 'AddOrRemoveNodeProvider', label: 'Add a new node provider' },
		{ value: 'CreateServiceNervousSystem', label: 'Propose a SNS' }
	];

	const proposalOptionsSns: ProposalOptions = [
		{ value: 'Motion', label: 'Motion' },
		{
			value: 'TransferSnsTreasuryFunds',
			label: 'Transfer treasury funds'
		}
	];

	let proposalOptions: ProposalOptions;
	$: proposalOptions = $governanceTypeStore !== 'icp' ? proposalOptionsSns : proposalOptionsNns;
</script>

<InputSelect bind:value={proposalAction} on:change={save}>
	{#if isNullish(proposalAction)}
		<option value={undefined}>Select a type...</option>
	{/if}

	{#each proposalOptions as option (option.value)}
		<option value={option.value}>{option.label}</option>
	{/each}
</InputSelect>
