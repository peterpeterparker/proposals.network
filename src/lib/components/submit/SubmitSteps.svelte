<script lang="ts">
	import Step from '$lib/components/ui/Step.svelte';
	import { userInitialized, userNotSignedIn, userSignedIn } from '$lib/derived/user.derived';
	import { isNullish, nonNullish } from '@dfinity/utils';
	import { userStore } from '$lib/stores/user.store';

	export let step: undefined | 'write' | 'neuron' | 'review' | 'submit';

	let signInStatus: 'pending' | 'active' | 'done';
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
			(writeStatus =
				(isNullish(step) && $userSignedIn) || step === 'write'
					? 'active'
					: signInStatus === 'active'
					  ? 'pending'
					  : $userSignedIn
					    ? 'done'
					    : 'pending'))();

	$: step,
		(() =>
			(neuronStatus =
				step === 'neuron'
					? 'active'
					: nonNullish(step) && ['review', 'submit'].includes(step)
					  ? 'done'
					  : 'pending'))();

	$: step,
		(() =>
			(reviewStatus =
				step === 'review'
					? 'active'
					: nonNullish(step) && ['submit'].includes(step)
					  ? 'done'
					  : 'pending'))();
</script>

<aside
	class="flex justify-center lg:block lg:bg-cyan-200 lg:fixed lg:top-20 lg:left-0 lg:w-[300px] lg:h-screen lg:overflow-y-scroll lg:px-16 pt-36 lg:pt-16 lg:border-r-2 lg:border-black"
>
	<span class="hidden lg:inline-block text-lg font-bold mb-6">Submit a proposal</span>

	<ul class="flex lg:flex-col gap-3 lg:gap-1 lg:pb-16">
		<Step status={signInStatus}>
			<svelte:fragment slot="step">1</svelte:fragment>
			Sign-in
		</Step>

		<Step status={writeStatus}>
			<svelte:fragment slot="step">2</svelte:fragment>
			Write
		</Step>

		<Step status={neuronStatus}>
			<svelte:fragment slot="step">3</svelte:fragment>
			Neuron
		</Step>

		<Step status={reviewStatus}>
			<svelte:fragment slot="step">4</svelte:fragment>
			Review
		</Step>

		<Step status={step === 'submit' ? 'active' : 'pending'}>
			<svelte:fragment slot="step">5</svelte:fragment>
			Submit
		</Step>
	</ul>
</aside>
