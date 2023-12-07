<script lang="ts">
	import { nonNullish } from '@dfinity/utils';
	import ExternalLink from '$lib/components/ui/ExternalLink.svelte';

	export let proposalId: bigint | undefined;

	let nnsDappUrl: string;
	$: nnsDappUrl = nonNullish(proposalId)
		? `https://nns.ic0.app/proposal/?u=qoctq-giaaa-aaaaa-aaaea-cai&proposal=${proposalId}`
		: 'https://nns.ic0.app/proposals';
</script>

<p class="leading-relaxed mb-4">
	You can either return to the <a href="/" class="underline underline-offset-8">home page</a> or
	open the proposal to vote in <ExternalLink href={nnsDappUrl} underline="visible">NNS dapp</ExternalLink>.
</p>
