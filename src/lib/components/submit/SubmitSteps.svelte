<script lang="ts">
	import Step from '$lib/components/ui/Step.svelte';
	import { userInitialized } from '$lib/derived/user.derived';

	export let step: 'sign-in' | 'write' | 'hotkey' | 'review' | 'submit';
</script>

<aside
	class="flex justify-center lg:block lg:bg-cyan-200 lg:fixed lg:top-20 lg:left-0 lg:w-[300px] lg:h-screen lg:overflow-y-scroll lg:px-16 pt-36 lg:pt-16 lg:border-r-2 lg:border-black"
>
	<label class="hidden lg:inline-block text-lg font-bold mb-4">Submit a proposal</label>

	<ul class="flex lg:flex-col gap-3 lg:gap-1 lg:pb-16">
		<Step active={step === 'sign-in' && $userInitialized}>
			<svelte:fragment slot="step">1</svelte:fragment>
			Sign-in
		</Step>

		<Step active={step === 'write'}>
			<svelte:fragment slot="step">2</svelte:fragment>
			Write
		</Step>

		<Step active={step === 'hotkey'}>
			<svelte:fragment slot="step">3</svelte:fragment>
			Hotkey
		</Step>

		<Step active={step === 'review'}>
			<svelte:fragment slot="step">4</svelte:fragment>
			Review
		</Step>

		<Step active={step === 'submit'}>
			<svelte:fragment slot="step">5</svelte:fragment>
			Submit
		</Step>
	</ul>
</aside>
