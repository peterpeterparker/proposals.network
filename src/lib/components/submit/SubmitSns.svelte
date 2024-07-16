<script lang="ts">
	import SubmitTitle from '$lib/components/submit/SubmitTitle.svelte';
	import SubmitSnsAttachYamlFile from '$lib/components/submit/SubmitSnsAttachYamlFile.svelte';
	import SubmitSnsAttachLogoFile from '$lib/components/submit/SubmitSnsAttachLogoFile.svelte';
	import { createEventDispatcher, getContext } from 'svelte';
	import { assertCreateServiceNervousSystemAssets } from '$lib/services/submit.sns.services';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import SubmitContinue from '$lib/components/submit/SubmitContinue.svelte';
	import { blur } from 'svelte/transition';
	import Button from '$lib/components/ui/Button.svelte';
	import Copy from '$lib/components/ui/Copy.svelte';
	import { isBusy } from '$lib/derived/busy.derived';
	import SubmitSnsContent from '$lib/components/submit/SubmitSnsContent.svelte';

	const { store }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);

	let step: 'params' | 'draft' | 'controllers' = 'params';

	const dispatch = createEventDispatcher();
	const next = async () => {
		const { valid } = await assertCreateServiceNervousSystemAssets($store?.key);

		if (!valid) {
			return;
		}

		dispatch('pnwrkNext');
	};
</script>

{#if step === 'params'}
	<div in:blur>
		<SubmitTitle>Propose Your SNS</SubmitTitle>

		<h2 class="mb-6 text-2xl">
			To propose an SNS, you need its parameters (provided in a configuration file) and a logo.
		</h2>

		<SubmitSnsAttachYamlFile />

		<SubmitSnsAttachLogoFile />

		<SubmitContinue on:click={() => (step = 'draft')} />
	</div>
{:else if step === 'draft'}
	<div in:blur>
		<SubmitSnsContent on:pnwrkNext={() => (step = 'controllers')} />
	</div>
{:else}
	<div in:blur>
		<SubmitTitle>Verify Your Controllers</SubmitTitle>

		<h2 class="mb-6 text-2xl">
			One last thing: prepare the decentralization of your smart contracts.
		</h2>

		<p class="leading-relaxed mb-2">
			Did you set the the NNS root canister <Copy
				value="r7inp-6aaaa-aaaaa-aaabq-cai"
				text="NNS root canister ID copied."
			/> as an additional controller of your dApps?
		</p>

		<p class="leading-relaxed text-sm mt-8 mb-12 italic">
			* Ignore this step if your project is associated with no canisters.
		</p>

		<div class="flex gap-2">
			<Button color="quaternary" type="button" disabled={$isBusy} on:click={() => (step = 'draft')}
				>Back</Button
			>
			<Button color="secondary" on:click={next}>Yes, continue</Button>
		</div>
	</div>
{/if}
