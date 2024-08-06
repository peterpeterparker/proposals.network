<script lang="ts">
	import { fade } from 'svelte/transition';
	import { ICPToken, isNullish, TokenAmountV2 } from '@dfinity/utils';
	import { getEditable, setContent } from '$lib/services/idb.services';
	import OopsError from '$lib/components/ui/OopsError.svelte';
	import SubmitWriteContent from '$lib/components/submit/SubmitWriteContent.svelte';
	import SpinnerText from '$lib/components/ui/SpinnerText.svelte';
	import template from '$lib/markdown/proposal-template.md?raw';
	import snsTemplate from '$lib/markdown/sns-proposal-treasury-funds.md?raw';
	import SubmitContinue from '$lib/components/submit/SubmitContinue.svelte';
	import Title from '$lib/components/ui/Title.svelte';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import { createEventDispatcher, getContext } from 'svelte';
	import { isBusy } from '$lib/derived/busy.derived';
	import Button from '$lib/components/ui/Button.svelte';
	import { governanceStore } from '$lib/derived/governance.derived';
	import { formatToken } from '$lib/utils/token.utils';

	const { store }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);

	let status: 'loading' | 'ok' | 'error' = 'loading';

	const init = async () => {
		const [metadata, existingContent, key] = await getEditable();

		if (isNullish(key)) {
			status = 'error';
			return;
		}

		if (existingContent !== template) {
			status = 'ok';
			return;
		}

		const { destinationAccount, amount } = metadata;

		if (isNullish(destinationAccount) || isNullish(amount)) {
			status = 'error';
			return;
		}

		const formattedAmount = formatToken(
			TokenAmountV2.fromUlps({
				amount: BigInt(amount),
				token: ICPToken
			})
		);

		const content = snsTemplate
			.replaceAll('<AMOUNT>', formattedAmount)
			.replaceAll('<DESTINATION_ADDRESS>', destinationAccount)
			.replaceAll('<GOVERNANCE>', $governanceStore?.name ?? 'Internet Computer')
			.replaceAll('<TOKEN_SYMBOL>', 'ICP');

		await setContent(content);

		status = 'ok';
	};

	$: $store, (async () => init())();

	const dispatch = createEventDispatcher();

	const onContinue = async () => dispatch('pnwrkNext');
	const onBack = async () => dispatch('pnwrkBack');
</script>

{#if status !== 'error'}
	<Title>Craft Your Proposal</Title>

	<h2 class="mb-6 text-2xl">
		Great stuff 💪! In addition to the amount and destination, you also need to craft a proposal.
	</h2>

	{#if status === 'loading'}
		<SpinnerText>Hold tight, loading the content...</SpinnerText>
	{:else if status === 'ok'}
		<SubmitWriteContent />

		<div class="flex gap-2">
			<Button color="quaternary" type="button" disabled={$isBusy} on:click={onBack}>Back</Button>
			<SubmitContinue on:click={onContinue} />
		</div>
	{/if}
{:else}
	<div in:fade>
		<OopsError />
	</div>
{/if}
