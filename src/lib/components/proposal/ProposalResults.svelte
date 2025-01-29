<script lang="ts">
	import { getContext } from 'svelte';
	import type { ProposalContext } from '$lib/types/proposal.context';
	import { PROPOSAL_CONTEXT_KEY } from '$lib/types/proposal.context';
	import { E8S_PER_ICP } from '$lib/constants/app.constants';
	import { formatPercentage } from '$lib/utils/format.utils';
	import Container from '$lib/components/ui/Container.svelte';
	import ProgressBar from '$lib/components/ui/ProgressBar.svelte';

	const { store }: ProposalContext = getContext<ProposalContext>(PROPOSAL_CONTEXT_KEY);

	let yes = $derived(Number($store?.proposal?.latestTally?.yes ?? 0) / E8S_PER_ICP);

	let no = $derived(Number($store?.proposal?.latestTally?.no ?? 0) / E8S_PER_ICP);

	let total = $derived(Number($store?.proposal?.latestTally?.total ?? 0) / E8S_PER_ICP);

	let yesProportion = $derived(total ? yes / total : 0);

	let noProportion = $derived(total ? no / total : 0);

	// A proposal is immediately adopted or rejected if, before the voting period ends, more than half of the total voting power votes Yes, or at least half votes No, respectively.
	let immediateMajority = $derived(yesProportion > 0.5);
	// At the end of the voting period, a proposal is adopted if more than half of the votes cast are Yes votes, provided these votes represent at least 3% of the total voting power. Otherwise, it is rejected. Before a proposal is decided, the voting period can be extended in order to “wait for quiet”. Such voting period extensions occur when a proposal’s voting results turn from either a Yes majority to a No majority or vice versa.
	let standardMajority = $derived(
		yesProportion > (yesProportion + noProportion) / 2 / 100 && yesProportion > 0.03
	);

	let yesPercentage = $derived(formatPercentage(yesProportion, { minFraction: 0, maxFraction: 2 }));

	let noPercentage = $derived(formatPercentage(noProportion, { minFraction: 0, maxFraction: 2 }));

	let color: 'cyan' | 'violet' | 'orange' | 'red' | 'yellow' | 'lime' | 'pink' = $derived(
		immediateMajority || standardMajority ? 'lime' : 'cyan'
	);

	let containerColor: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary' = $derived(
		immediateMajority || standardMajority ? 'tertiary' : 'quinary'
	);
</script>

<Container color={containerColor}>
	<svelte:fragment slot="title">Voting Results</svelte:fragment>

	<div class="p-12">
		<ProgressBar currentValue={(yesProportion ?? 0) * 100} {color} />

		<div class="flex flex-col sm:flex-row justify-center gap-4 mt-8">
			<div
				class="bg-black border-2 border-black flex items-center justify-between py-1 px-1 gap-2 rounded-lg min-w-[160px]"
			>
				<div class="flex items-center p-2 rounded-lg gap-2 mr-1">
					<div class="h-4 w-4 rounded-full bg-lime-400"></div>
					<span class="pr-5 text-white">Yes</span>
				</div>
				<output class="text-white pr-2">{yesPercentage}</output>
			</div>

			<div
				class="bg-black border-2 border-black flex items-center justify-between py-1 px-1 gap-2 rounded-lg min-w-[160px]"
			>
				<div class="flex items-center p-2 rounded-lg gap-2 mr-1">
					<div class="h-4 w-4 rounded-full bg-red-300"></div>
					<span class="pr-5 text-white">No</span>
				</div>
				<output class="text-white pr-2">{noPercentage}</output>
			</div>
		</div>
	</div>
</Container>
