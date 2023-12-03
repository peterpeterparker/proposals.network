<script lang="ts">
	import Confetti from '$lib/components/ui/Confetti.svelte';
	import IconCelebration from '$lib/components/icons/IconCelebration.svelte';
	import { nonNullish } from '@dfinity/utils';
	import ExternalLink from '$lib/components/ui/ExternalLink.svelte';

	export let proposalId: bigint | undefined;

	let nnsDappUrl: string;
	$: nnsDappUrl = nonNullish(proposalId)
		? `https://nns.ic0.app/proposal/?u=qoctq-giaaa-aaaaa-aaaea-cai&proposal=${proposalId}`
		: 'https://nns.ic0.app/proposals';
</script>

<h1 class="font-bold capitalize text-4xl mb-12 inline-flex items-center gap-2">
	Hooray! <IconCelebration />
</h1>

<h2 class="text-2xl mb-6">Your proposal has been submitted successfully!</h2>

<p class="leading-relaxed mb-4">
	You can either return to the <a href="/" class="underline underline-offset-8">home page</a> or
	open the proposal to vote in <ExternalLink href={nnsDappUrl}>NNS dapp</ExternalLink>.
</p>

<Confetti />
