<script lang="ts">
	import { fade } from 'svelte/transition';
	import { getSnsData } from '$lib/services/submit.sns.services';
	import { isNullish } from '@dfinity/utils';
	import { getEditable, setContent } from '$lib/services/idb.services';
	import SubmitError from '$lib/components/submit/SubmitError.svelte';
	import SubmitWriteContent from '$lib/components/submit/SubmitWriteContent.svelte';
	import SpinnerText from '$lib/components/ui/SpinnerText.svelte';
	import template from '$lib/markdown/proposal-template.md?raw';
	import snsTemplate from '$lib/markdown/sns-proposal-template.md?raw';
	import SubmitContinue from '$lib/components/submit/SubmitContinue.svelte';
	import SubmitTitle from '$lib/components/submit/SubmitTitle.svelte';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import { getContext } from 'svelte';

	const { store }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);

	let status: 'loading' | 'ok' | 'error' = 'loading';

	const init = async () => {
		const [_, existingContent, key] = await getEditable();

		if (isNullish(key)) {
			status = 'error';
			return;
		}

		if (existingContent !== template) {
			status = 'ok';
			return;
		}

		const { result, yaml } = await getSnsData(key);

		if (result === 'error' || isNullish(yaml)) {
			status = 'error';
			return;
		}

		const {
			name,
			description,
			url,
			Swap: { duration },
			Token: { name: tokenName, symbol }
		} = yaml;

		const content = snsTemplate
			.replaceAll('<SNS_NAME>', name)
			.replaceAll('<SNS_DESCRIPTION>', description)
			.replaceAll('<TOKEN_NAME>', tokenName)
			.replaceAll('<TOKEN_SYMBOL>', symbol)
			.replaceAll('<DURATION>', duration)
			.replaceAll(
				'<URL>',
				`<a href="${url}" target="_blank" rel="noopener noreferrer">${url.replace('https://', '')}</a>`
			);
		await setContent(content);

		status = 'ok';
	};

	$: $store, (async () => init())();
</script>

{#if status !== 'error'}
	<SubmitTitle>Craft Your Proposal</SubmitTitle>

	<h2 class="mb-6 text-2xl">
		Cool stuff 💪! In addition to the details of your SNS, you also need to craft a proposal.
	</h2>

	{#if status === 'loading'}
		<SpinnerText>Hold tight, loading the content...</SpinnerText>
	{:else if status === 'ok'}
		<SubmitWriteContent />

		<SubmitContinue on:click />
	{/if}
{:else}
	<div in:fade>
		<SubmitError />
	</div>
{/if}
