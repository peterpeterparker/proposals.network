<script lang="ts">
	import { PROPOSAL_CONTEXT_KEY, type ProposalContext } from '$lib/types/proposal.context';
	import { getContext } from 'svelte';

	const { store }: ProposalContext = getContext<ProposalContext>(PROPOSAL_CONTEXT_KEY);

	let title: string | undefined;
	$: title = $store?.proposal?.title;
</script>

<h1 class="font-bold capitalize mb-12 text-5xl lg:text-7xl break-all">
	{title ?? 'Proposal'}
</h1>

<style lang="scss">
	@use '../../styles/mixins/text';

	h1 {
		@include text.clamp(4);
	}
</style>
