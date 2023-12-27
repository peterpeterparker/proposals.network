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
	import { governanceIdStore } from '$lib/derived/governance.derived';
	import SubmitNeuronRequirements from '$lib/components/submit/SubmitNeuronRequirements.svelte';

	export let neuronId: string | undefined;

	let step: 'hotkey' | 'neuron_id' = 'hotkey';

	let status: 'loading' | 'ok' | 'error' = 'loading';
	let neuron: Doc<Neuron> | undefined;

	onMount(async () => {
		const { result, neuron: n } = await getNeuron($userStore);
		neuron = n;
		neuronId = firstNeuronId({ neuron, governanceId: $governanceIdStore });
		status = result;
	});
</script>

{#if status !== 'error'}
	<h1 class="font-bold capitalize text-4xl md:text-6xl mb-12">Only Neurons can submit proposals</h1>

	<SubmitNeuronRequirements />

	{#if status === 'loading'}
		<SpinnerText>Hold tight, loading neuron metadata...</SpinnerText>
	{:else}
		<div in:fade>
			{#if nonNullish(neuron) && nonNullish(neuronId)}
				<SubmitNeuronMetadata {neuronId} on:pnwrkReview />
			{:else if step === 'hotkey'}
				<div in:blur>
					<SubmitNeuronHotkey on:click={() => (step = 'neuron_id')} />
				</div>
			{:else}
				<div in:blur>
					<SubmitNeuronForm {neuron} on:pnwrkNext on:pnwrkBack={() => (step = 'hotkey')} />
				</div>
			{/if}
		</div>
	{/if}
{:else}
	<div in:fade>
		<SubmitError />
	</div>
{/if}
