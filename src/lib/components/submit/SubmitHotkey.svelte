<script lang="ts">
	import { userStore } from '$lib/stores/user.store';
	import Copy from '$lib/components/ui/Copy.svelte';
	import { blur } from 'svelte/transition';
	import Button from '$lib/components/ui/Button.svelte';
	import { onMount } from 'svelte';
	import type { Doc } from '@junobuild/core';
	import type { Neuron } from '$lib/types/juno';
	import { getNeuron } from '$lib/services/neuron.services';
	import { fade } from 'svelte/transition';
	import SpinnerScreen from '$lib/components/ui/SpinnerScreen.svelte';
	import SubmitHokeyForm from '$lib/components/submit/SubmitHokeyForm.svelte';
	import SpinnerText from '$lib/components/ui/SpinnerText.svelte';

	let step: 'hotkey' | 'neuron_id' = 'hotkey';

	let status: 'loading' | 'ok' | 'error' = 'loading';
	let neuron: Doc<Neuron> | undefined;

	onMount(async () => {
		const { result, neuron: n } = await getNeuron($userStore);
		neuron = n;
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
			{#if step === 'hotkey'}
				<div class="transition-opacity" in:blur>
					<p class="leading-relaxed mb-4">
						Copy your principal <Copy value={$userStore?.key ?? ''} text="Principal copied." /> and add
						it as a hotkey to your neuron. This will grant control of the neuron to the user identified
						by the principal on proposals.network.
					</p>

					<Button color="secondary" on:click={() => (step = 'neuron_id')}>Done</Button>
				</div>
			{:else}
				<div class="transition-opacity" in:blur>
					<SubmitHokeyForm {neuron} on:pnwrkNext />
				</div>
			{/if}
		</div>
	{/if}
{:else}
	<div in:fade>
		<h1 class="font-bold capitalize text-4xl mb-12">Oops!</h1>

		<h2 class="text-2xl mb-8">It looks like something didn't go as planned.</h2>

		<p class="leading-relaxed mb-4">
			Please try reloading your screen. If the issue persists, please report it on our <a
				href="https://github.com/peterpeterparker/proposals.network"
				target="_blank"
				class="underline underline-offset-2"
				rel="noopener noreferrer nofollow">GitHub repository</a
			>.
		</p>
	</div>
{/if}
