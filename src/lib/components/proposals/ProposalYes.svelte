<script lang="ts">
	import type { ProposalInfo } from '@dfinity/nns';
	import { E8S_PER_ICP } from '$lib/constants/app.constants';
	import { formatPercentage } from '$lib/utils/format.utils';

	export let proposalInfo: ProposalInfo;

	let yes: number;
	$: yes = Number(proposalInfo?.latestTally?.yes ?? 0) / E8S_PER_ICP;

	let total: number;
	$: total = Number(proposalInfo?.latestTally?.total ?? 0) / E8S_PER_ICP;

	let yesProportion: number;
	$: yesProportion = total ? yes / total : 0;
</script>

<span>{formatPercentage(yesProportion, { minFraction: 0, maxFraction: 2 })}</span>
