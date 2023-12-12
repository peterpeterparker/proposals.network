<script lang="ts">
	import { E8S_PER_ICP } from '$lib/constants/app.constants';
	import { formatPercentage } from '$lib/utils/format.utils';
	import type { Proposal } from '$lib/types/governance';

	export let proposal: Proposal;

	let yes: number;
	$: yes = Number(proposal.vote.yes ?? 0) / E8S_PER_ICP;

	let total: number;
	$: total = Number(proposal.vote.total ?? 0) / E8S_PER_ICP;

	let yesProportion: number;
	$: yesProportion = total ? yes / total : 0;
</script>

<span>{formatPercentage(yesProportion, { minFraction: 0, maxFraction: 2 })}</span>
