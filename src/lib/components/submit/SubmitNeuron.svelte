<script lang="ts">
	import { userStore } from '$lib/stores/user.store';
	import { blur } from 'svelte/transition';
	import { onMount } from 'svelte';
	import type { Doc } from '@junobuild/core-peer';
	import type { Neuron } from '$lib/types/juno';
	import { getNeuron } from '$lib/services/neuron.services';
	import { fade } from 'svelte/transition';
	import SubmitNeuronForm from '$lib/components/submit/SubmitNeuronForm.svelte';
	import SpinnerText from '$lib/components/ui/SpinnerText.svelte';
	import SubmitNeuronHotkey from '$lib/components/submit/SubmitNeuronHotkey.svelte';
	import { nonNullish } from '@dfinity/utils';
	import SubmitNeuronMetadata from '$lib/components/submit/SubmitNeuronMetadata.svelte';
	import { firstNeuronId } from '$lib/utils/juno.utils';
	import SubmitError from '$lib/components/submit/SubmitError.svelte';

	export let neuronId: bigint | undefined;

	let step: 'hotkey' | 'neuron_id' = 'hotkey';

	let status: 'loading' | 'ok' | 'error' = 'loading';
	let neuron: Doc<Neuron> | undefined;

	onMount(async () => {
		const { result, neuron: n } = await getNeuron($userStore);
		neuron = n;
		neuronId = firstNeuronId(neuron);
		status = result;
	});
</script>

{#if status !== 'error'}
	<h1 class="font-bold capitalize text-4xl mb-12">Only Neurons can submit proposals</h1>

	<h2 class="text-2xl mb-8">
		Neurons with at least 10 ICP and a 6-month dissolve delay can submit motion proposals. So the
		next step is to add a hotkey to your neuron that meets these criteria.
	</h2>

	{#if status === 'loading'}
		<SpinnerText>Hold tight, loading neuron metadata...</SpinnerText>
	{:else}
		<div in:fade>
			{#if nonNullish(neuron) && nonNullish(neuronId)}
				<SubmitNeuronMetadata {neuronId} on:pnwrkNext />
			{:else if step === 'hotkey'}
				<div in:blur>
					<SubmitNeuronHotkey on:click={() => (step = 'neuron_id')} />
				</div>
			{:else}
				<div in:blur>
					<SubmitNeuronForm {neuron} on:pnwrkNext />
				</div>
			{/if}
		</div>
	{/if}
{:else}
	<div in:fade>
		<SubmitError />
	</div>
{/if}
