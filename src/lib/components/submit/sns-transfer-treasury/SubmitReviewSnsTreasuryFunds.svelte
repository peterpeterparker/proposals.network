<script lang="ts">
	import Container from '$lib/components/ui/Container.svelte';
	import HtmlMarkdown from '$lib/components/ui/HtmlMarkdown.svelte';
	import type { ProposalContent } from '$lib/types/juno';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import { getContext } from 'svelte';
	import { ICPToken, nonNullish, TokenAmountV2 } from '@dfinity/utils';
	import { formatToken } from '$lib/utils/token.utils';

	export let content: ProposalContent | undefined;

	const { store }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);

	let amount: string;
	$: amount = nonNullish($store?.metadata?.amount)
		? formatToken(
				TokenAmountV2.fromUlps({
					amount: $store.metadata.amount,
					token: ICPToken
				})
			)
		: '';
</script>

<Container>
	<aside slot="title">Destination address</aside>
	<article class="p-2.5">{$store?.metadata?.destinationAddress ?? ''}</article>
</Container>

<Container>
	<aside slot="title">Amount in ICP</aside>
	<article class="p-2.5">{amount}</article>
</Container>

<HtmlMarkdown {content} />
