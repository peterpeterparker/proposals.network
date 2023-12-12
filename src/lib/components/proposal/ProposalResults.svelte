<script lang="ts">
	import IconVotingResults from '$lib/components/icons/IconVotingResults.svelte';
	import { getContext } from 'svelte';
	import type { ProposalContext } from '$lib/types/proposal.context';
	import { PROPOSAL_CONTEXT_KEY } from '$lib/types/proposal.context';
	import { E8S_PER_ICP } from '$lib/constants/app.constants';
	import { formatPercentage } from '$lib/utils/format.utils';
	import Container from '$lib/components/ui/Container.svelte';

	const { store }: ProposalContext =
		getContext<ProposalContext>(PROPOSAL_CONTEXT_KEY);

	let yes: number;
	$: yes = Number($store?.proposal?.latestTally?.yes ?? 0) / E8S_PER_ICP;

	let no: number;
	$: no = Number($store?.proposal?.latestTally?.no ?? 0) / E8S_PER_ICP;

	let total: number;
	$: total = Number($store?.proposal?.latestTally?.total ?? 0) / E8S_PER_ICP;

	let yesProportion: number;
	$: yesProportion = total ? yes / total : 0;

	let noProportion: number;
	$: noProportion = total ? no / total : 0;

	let yesPercentage: string;
	$: yesPercentage = formatPercentage(yesProportion, { minFraction: 0, maxFraction: 2 });

	let noPercentage: string;
	$: noPercentage = formatPercentage(noProportion, { minFraction: 0, maxFraction: 2 });

	let yesPercentageDisplay: string;
	$: yesPercentageDisplay = formatPercentage(
		yesProportion >= noProportion ? yesProportion + noProportion : yesProportion,
		{ minFraction: 0, maxFraction: 2 }
	);

	let noPercentageDisplay: string;
	$: noPercentageDisplay = formatPercentage(
		noProportion > yesProportion ? yesProportion + noProportion : noProportion,
		{ minFraction: 0, maxFraction: 2 }
	);
</script>

<Container color={noProportion > yesProportion ? 'quinary' : 'tertiary'}>
	<svelte:fragment slot="title">Voting Results</svelte:fragment>

	<div class="p-12">
		<div class="items-center justify-center relative hidden sm:flex">
			<div
				class="absolute rounded-full top-1/2 left-1/2 mt-2 transform -translate-x-1/2 -translate-y-1/2 h-[165px] w-[188px] overflow-hidden -rotate-[19.5deg]"
			>
				<div
					class="absolute bottom-0 left-1/2 -translate-x-1/2 bg-lime-400 w-full border-b-4 border-black"
					class:z-20={yesProportion > noProportion}
					class:z-40={yesProportion <= noProportion}
					style={`height: ${yesPercentageDisplay}`}
				></div>
				<div
					class="absolute bottom-0 left-1/2 -translate-x-1/2 bg-red-300 w-full"
					class:z-20={noProportion > yesProportion}
					class:z-40={noProportion < yesProportion}
					style={`height: ${noPercentageDisplay}`}
				></div>
			</div>

			<div class="block z-10">
				<IconVotingResults />
			</div>
		</div>

		<div class="flex flex-col sm:flex-row justify-center gap-4 sm:mt-8">
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
