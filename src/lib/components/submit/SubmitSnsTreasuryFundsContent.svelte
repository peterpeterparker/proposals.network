<script lang="ts">
	import { fade } from 'svelte/transition';
	import { getSnsData } from '$lib/services/submit.sns.services';
	import { isNullish, nonNullish } from '@dfinity/utils';
	import { getEditable, setContent } from '$lib/services/idb.services';
	import OopsError from '$lib/components/ui/OopsError.svelte';
	import SubmitWriteContent from '$lib/components/submit/SubmitWriteContent.svelte';
	import SpinnerText from '$lib/components/ui/SpinnerText.svelte';
	import template from '$lib/markdown/proposal-template.md?raw';
	import snsTemplate from '$lib/markdown/sns-proposal-template.md?raw';
	import SubmitContinue from '$lib/components/submit/SubmitContinue.svelte';
	import Title from '$lib/components/ui/Title.svelte';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import { createEventDispatcher, getContext } from 'svelte';
	import { mapSnsYamlForContent } from '$lib/utils/sns-make-proposal.utils';
	import { isBusy } from '$lib/derived/busy.derived';
	import Button from '$lib/components/ui/Button.svelte';

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

		const { result, yaml } = await getSnsData({ key, assertLogo: false });

		if (result === 'error' || isNullish(yaml)) {
			status = 'error';
			return;
		}

		if (nonNullish(yaml.NnsProposal.summary) && yaml.NnsProposal.summary !== '') {
			await setContent(yaml.NnsProposal.summary);
			status = 'ok';
			return;
		}

		const {
			minimumParticipantIcp,
			maximumParticipantIcp,
			minDirectParticipationIcp,
			maxDirectParticipationIcp,
			swapDistribution,
			treasuryDistribution,
			developersDistribution
		} = mapSnsYamlForContent(yaml);

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
			)
			.replaceAll('<MINIMUM_PARTICIPANT_ICP>', minimumParticipantIcp)
			.replaceAll('<MAXIMUM_PARTICIPANT_ICP>', maximumParticipantIcp)
			.replaceAll('<MIN_DIRECT_PARTICIPATION_ICP>', minDirectParticipationIcp)
			.replaceAll('<MAX_DIRECT_PARTICIPATION_ICP>', maxDirectParticipationIcp)
			.replaceAll('<TREASURY_DISTRIBUTION>', treasuryDistribution)
			.replaceAll('<SWAP_DISTRIBUTION>', swapDistribution)
			.replaceAll('<DEVELOPERS_DISTRIBUTION>', developersDistribution);
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
		Cool stuff 💪! In addition to the details of your SNS, you also need to craft a proposal.
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
