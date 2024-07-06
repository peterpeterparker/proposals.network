<script lang="ts">
	import InputText from '$lib/components/ui/InputText.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import type { Doc } from '@junobuild/core-peer';
	import type { Neuron } from '$lib/types/juno';
	import { isNullish } from '@dfinity/utils';
	import { setNeuron } from '$lib/services/neuron.services';
	import { userStore } from '$lib/stores/user.store';
	import { createEventDispatcher } from 'svelte';
	import { isBusy } from '$lib/derived/busy.derived';
	import { governanceIdStore } from '$lib/derived/governance.derived';

	export let neuron: Doc<Neuron> | undefined;
	let neuronId = '';

	let disabled = true;
	$: disabled = isNullish(neuronId) || neuronId === '';

	const dispatch = createEventDispatcher();
	const next = (neuron: Doc<Neuron> | undefined) => dispatch('pnwrkNext', neuron);
	const back = () => dispatch('pnwrkBack');

	const onSubmit = async () => {
		const { result, neuron: createdNeuron } = await setNeuron({
			user: $userStore,
			neuron,
			neuronId,
			governanceId: $governanceIdStore
		});

		if (result === 'error') {
			return;
		}

		next(createdNeuron);
	};
</script>

<form on:submit|preventDefault={onSubmit}>
	<p class="leading-relaxed mb-4">
		You're almost there! Now that your principal controls your neuron, enter your neuron ID. This ID
		will be used to link the proposal with your neuron.
	</p>

	<div class="mb-5">
		<InputText placeholder="Neuron ID" bind:value={neuronId} disabled={$isBusy} />
	</div>

	<div class="flex gap-2">
		<Button color="quaternary" type="button" disabled={$isBusy} on:click={back}>Back</Button>
		<Button color="secondary" type="submit" disabled={$isBusy || disabled}>Save and continue</Button
		>
	</div>
</form>
