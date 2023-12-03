<script lang="ts">
	import SubmitSteps from '$lib/components/submit/SubmitSteps.svelte';
	import { fade } from 'svelte/transition';
	import UserInitializedGuard from '$lib/components/guards/UserInitializedGuard.svelte';
	import { userNotSignedIn } from '$lib/derived/user.derived';
	import SubmitSignIn from '$lib/components/submit/SubmitSignIn.svelte';
	import SubmitWrite from '$lib/components/submit/SubmitWrite.svelte';
	import { routeKey } from '$lib/derived/nav.derived';
	import { userStore } from '$lib/stores/user.store';
	import { initUserProposal } from '$lib/services/submit.services';
	import { goto } from '$app/navigation';
	import { confirmToCloseBrowser } from '$lib/utils/before-unload.utils';
	import SubmitNeuron from '$lib/components/submit/SubmitNeuron.svelte';
	import SubmitReview from '$lib/components/submit/SubmitReview.svelte';
	import { isWizardBusy } from '$lib/derived/busy.derived';
	import SubmitDone from '$lib/components/submit/SubmitDone.svelte';

	let step: undefined | 'write' | 'neuron' | 'review' | 'submitted' = undefined;
	let neuronId: bigint | undefined;
	let proposalId: bigint | undefined;

	const init = async () => {
		const { result } = await initUserProposal({ user: $userStore, routeKey: $routeKey });

		if (result === 'error') {
			await goto('/', { replaceState: true });
			return;
		}

		if (result === 'not_allowed') {
			step = undefined;
			return;
		}

		step = 'write';
	};

	$: $userStore, $routeKey, (async () => await init())();

	$: confirmToCloseBrowser($isWizardBusy);

	const done = ({detail}: CustomEvent<bigint | undefined>) => {
		proposalId = detail;
		step = 'submitted';
	}
</script>

<div class="flex flex-col lg:flex-row min-h-screen" in:fade>
	<SubmitSteps {step} />

	<UserInitializedGuard>
		<div
			class="w-full lg:w-[calc(100%-300px)] lg:ml-[300px] px-4 lg:px-16 pt-9 lg:pt-36 pb-36 h-full"
		>
			{#if $userNotSignedIn}
				<SubmitSignIn />
			{:else if step === 'write'}
				<SubmitWrite on:pnwrkNext={() => (step = 'neuron')} />
			{:else if step === 'neuron'}
				<SubmitNeuron on:pnwrkNext={() => (step = 'review')} bind:neuronId />
			{:else if step === 'review'}
				<SubmitReview
					{neuronId}
					on:pnwrkNext={() => (step = 'submitted')}
					on:pnwrkDone={done}
				/>
			{:else if step === 'submitted'}
				<SubmitDone {proposalId} />
			{/if}
		</div>
	</UserInitializedGuard>
</div>
