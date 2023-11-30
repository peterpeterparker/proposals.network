<script lang="ts">
	import Step from '$lib/components/ui/Step.svelte';
	import {
		userInitialized,
		userNotInitialized,
		userNotSignedIn,
		userSignedIn
	} from '$lib/derived/user.derived';
	import { debounce, isNullish } from '@dfinity/utils';
	import { userStore } from '$lib/stores/user.store';

	export let step: undefined | 'write' | 'hotkey' | 'review' | 'submit';

	$: console.log($userStore, step);

	let signInStatus: 'pending' | 'active' | 'done';
	let writeStatus: 'pending' | 'active' | 'done';
	let hotkeyStatus: 'pending' | 'active' | 'done';
	let reviewStatus: 'pending' | 'active' | 'done';

	const initSignInStatus = debounce(() => {
		signInStatus =
			isNullish(step) && $userInitialized
				? $userSignedIn
					? 'done'
					: $userNotSignedIn
					  ? 'active'
					  : 'pending'
				: 'pending';
	});

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
		() =>
			(hotkeyStatus =
				step === 'hotkey' ? 'active' : ['review', 'submit'].includes(step) ? 'done' : 'pending');

	$: step,
		() =>
			(reviewStatus =
				step === 'review' ? 'active' : ['submit'].includes(step) ? 'done' : 'pending');
</script>

<aside
	class="flex justify-center lg:block lg:bg-cyan-200 lg:fixed lg:top-20 lg:left-0 lg:w-[300px] lg:h-screen lg:overflow-y-scroll lg:px-16 pt-36 lg:pt-16 lg:border-r-2 lg:border-black"
>
	<label class="hidden lg:inline-block text-lg font-bold mb-4">Submit a proposal</label>

	<ul class="flex lg:flex-col gap-3 lg:gap-1 lg:pb-16">
		<Step status={signInStatus}>
			<svelte:fragment slot="step">1</svelte:fragment>
			Sign-in
		</Step>

		<Step status={writeStatus}>
			<svelte:fragment slot="step">2</svelte:fragment>
			Write
		</Step>

		<Step status={hotkeyStatus}>
			<svelte:fragment slot="step">3</svelte:fragment>
			Hotkey
		</Step>

		<Step status={reviewStatus}>
			<svelte:fragment slot="step">4</svelte:fragment>
			Review
		</Step>

		<Step status={step === 'submit'}>
			<svelte:fragment slot="step">5</svelte:fragment>
			Submit
		</Step>
	</ul>
</aside>
