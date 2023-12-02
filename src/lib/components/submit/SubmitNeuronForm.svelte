<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import type { Doc } from '@junobuild/core';
	import type { Neuron } from '$lib/types/juno';
	import { isNullish } from '@dfinity/utils';
	import { setNeuron } from '$lib/services/neuron.services';
	import { userStore } from '$lib/stores/user.store';
	import { createEventDispatcher } from 'svelte';
	import { isBusy } from '$lib/derived/busy.derived';

	export let neuron: Doc<Neuron> | undefined;
	let neuronId = '';

	let disabled = true;
	$: disabled = isNullish(neuronId) || neuronId === '';

	const dispatch = createEventDispatcher();
	const next = () => dispatch('pnwrkNext');

	const onSubmit = async () => {
		const { result } = await setNeuron({
			user: $userStore,
			neuron,
			neuronId
		});

		if (result === 'error') {
			return;
		}

		next();
	};
</script>

<form on:submit|preventDefault={onSubmit}>
	<p class="leading-relaxed mb-4">
		You're almost there! Now that your principal controls your neuron, enter your neuron ID. This ID
		will be used to link the proposal with your neuron.
	</p>

	<div class="mb-5">
		<Input placeholder="Neuron ID" bind:value={neuronId} disabled={$isBusy} />
	</div>

	<Button color="secondary" role="submit" disabled={$isBusy || disabled}>Save and continue</Button>
</form>
