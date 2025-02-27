<script lang="ts">
	import { ICPToken, nonNullish, secondsToDuration, TokenAmountV2 } from '@dfinity/utils';
	import { governanceStore, snsStore } from '$lib/derived/governance.derived';
	import { formatToken } from '$lib/utils/token.utils';

	const ICP_MIN_DISSOLVE_DELAY = 15_780_000; // 6 months
	const ICP_NEURON_MINIMUM_STAKE_E8S = 10; // 10 ICP

	let detailToVoteSeconds = ICP_MIN_DISSOLVE_DELAY;
	$: detailToVoteSeconds =
		$snsStore?.nervous_system_parameters.neuron_minimum_dissolve_delay_to_vote_seconds ??
		ICP_MIN_DISSOLVE_DELAY;

	let rejectCostE8s: number | undefined;
	$: rejectCostE8s = $snsStore?.nervous_system_parameters.reject_cost_e8s;

	let amount: TokenAmountV2 | undefined;
	$: $governanceStore,
		$snsStore,
		(() => {
			if (nonNullish($snsStore) && nonNullish(rejectCostE8s)) {
				amount =
					$governanceStore?.token !== undefined
						? TokenAmountV2.fromUlps({
								amount: BigInt(rejectCostE8s),
								token: $governanceStore.token
							})
						: undefined;

				return;
			}

			amount = TokenAmountV2.fromUlps({
				amount: BigInt(ICP_NEURON_MINIMUM_STAKE_E8S),
				token: ICPToken
			});
		})();
</script>

<h2 class="text-2xl mb-8">
	{#if nonNullish($snsStore)}
		Neurons with at least {nonNullish(amount) ? formatToken(amount) : '???'}
		{amount?.token.symbol ?? '???'} and a {secondsToDuration({
			seconds: BigInt(detailToVoteSeconds)
		})}
		dissolve delay can submit proposals. So the next step is to add a hotkey to your neuron that meets
		these criteria.
	{:else}
		Neurons with at least 25 ICP and a 6-month dissolve delay can submit proposals. So the next step
		is to add a hotkey to your neuron that meets these criteria.
	{/if}
</h2>
