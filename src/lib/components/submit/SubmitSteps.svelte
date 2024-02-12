<script lang="ts">
	import Step from '$lib/components/ui/Step.svelte';
	import { userInitialized, userNotSignedIn, userSignedIn } from '$lib/derived/user.derived';
	import { isNullish, nonNullish } from '@dfinity/utils';
	import { userStore } from '$lib/stores/user.store';
	import Aside from '$lib/components/ui/Aside.svelte';

	export let step: undefined | 'select' | 'write' | 'neuron' | 'review' | 'submitted' | 'readonly';

	let signInStatus: 'pending' | 'active' | 'done';
	let selectStatus: 'pending' | 'active' | 'done';
	let writeStatus: 'pending' | 'active' | 'done';
	let neuronStatus: 'pending' | 'active' | 'done';
	let reviewStatus: 'pending' | 'active' | 'done';

	const initSignInStatus = () => {
		signInStatus =
			isNullish(step) && $userInitialized
				? $userSignedIn
					? 'done'
					: $userNotSignedIn
						? 'active'
						: 'pending'
				: isNullish(step)
					? 'pending'
					: 'done';
	};

	$: step, $userStore, initSignInStatus();

	$: step,
		$userStore,
		(() =>
			(selectStatus =
				(isNullish(step) && $userSignedIn) || step === 'select'
					? 'active'
					: signInStatus === 'active'
						? 'pending'
						: $userSignedIn
							? 'done'
							: 'pending'))();
	
	$: step,
		(() =>
			(writeStatus =
				step === 'write'
					? 'active'
					: nonNullish(step) && selectStatus !== 'done'
						? 'pending'
						: signInStatus === 'done' && $userSignedIn
							? 'done'
							: 'pending'))();

	$: step,
		(() =>
			(neuronStatus =
				step === 'neuron'
					? 'active'
					: nonNullish(step) && ['review', 'submitted'].includes(step)
						? 'done'
						: 'pending'))();

	$: step,
		(() =>
			(reviewStatus =
				step === 'review'
					? 'active'
					: nonNullish(step) && ['submitted', 'readonly'].includes(step)
						? 'done'
						: 'pending'))();
</script>

<Aside>
	<svelte:fragment slot="title">Submit a proposal</svelte:fragment>

	<Step status={signInStatus}>
		<svelte:fragment slot="step">1</svelte:fragment>
		Sign-in
	</Step>

	<Step status={selectStatus}>
		<svelte:fragment slot="step">2</svelte:fragment>
		Select
	</Step>

	<Step status={writeStatus}>
		<svelte:fragment slot="step">3</svelte:fragment>
		Write
	</Step>

	<Step status={neuronStatus}>
		<svelte:fragment slot="step">4</svelte:fragment>
		Neuron
	</Step>

	<Step status={reviewStatus}>
		<svelte:fragment slot="step">5</svelte:fragment>
		Review
	</Step>

	<Step status={step === 'submitted' || step === 'readonly' ? 'active' : 'pending'}>
		<svelte:fragment slot="step">6</svelte:fragment>
		Done
	</Step>
</Aside>
