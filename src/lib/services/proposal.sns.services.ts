import { type SnsYaml } from '$lib/types/sns';
import type { CreateServiceNervousSystem, Tokens } from '@dfinity/nns';
import type { Duration, Percentage } from '@dfinity/nns/dist/types/types/governance_converters';
import { isNullish } from '@dfinity/utils';

const mapTokens = (fee: string): Tokens => ({
	e8s: BigInt(fee.replace('e8s', '').trim())
});

const mapPercentage = (percentage: string): Percentage => ({
	basisPoints: BigInt(percentage.replace('%', '').trim())
});

const mapDuration = (duration: string): Duration => {
	// DFINITY uses humantime crate
	// Source: https://github.com/dfinity/ic/blob/17df8febdb922c3981475035d830f09d9b990a5a/rs/nervous_system/humanize/src/lib.rs#L58
	// Crate: https://github.com/tailhook/humantime/blob/12ce6f50894a56a410b390e5608ac9db8afe2407/src/duration.rs#L123
	const unitsToSeconds: Record<string, number> = {
		seconds: 1,
		second: 1,
		sec: 1,
		s: 1,
		minutes: 60,
		minute: 60,
		min: 60,
		m: 60,
		hours: 3600,
		hour: 3600,
		hr: 3600,
		h: 3600,
		days: 86400,
		day: 86400,
		d: 86400,
		weeks: 604800,
		week: 604800,
		w: 604800,
		months: 2630016, // 30.44 days
		month: 2630016,
		M: 2630016,
		years: 31557600, // 365.25 days
		year: 31557600,
		y: 31557600
	};

	let totalSeconds = 0;

	const durationParts = duration.match(
		/\d+\s*(seconds?|sec|s|minutes?|min|m|hours?|hr|h|days?|d|weeks?|w|months?|M|years?|y)/g
	);

	if (isNullish(durationParts)) {
		throw new Error(`Invalid duration string: ${duration}`);
	}

	durationParts.forEach((part) => {
		const matches = part.match(/\d+|\D+/g);

		if (isNullish(matches) || matches.length !== 2) {
			throw new Error(`Invalid duration part: ${duration} - ${part}`);
		}

		const [value, unit] = matches;
		totalSeconds += parseInt(value) * (unitsToSeconds[unit.trim().toLowerCase()] ?? 0);
	});

	return {
		seconds: BigInt(totalSeconds)
	};
};

// Map source: https://github.com/dfinity/ic/blob/17df8febdb922c3981475035d830f09d9b990a5a/rs/registry/admin/src/main.rs#L2592
export const mapSnsYamlToCreateServiceNervousSystem = ({
	name,
	description,
	url,
	Token,
	Voting,
	Proposals,
	Neurons,
	fallback_controller_principals: fallbackControllerPrincipalIds,
	dapp_canisters: dappCanisters,
	Swap
}: SnsYaml): CreateServiceNervousSystem => {
	return {
		name,
		url,
		description,
		logo: undefined, // TODO
		ledgerParameters: {
			transactionFee: mapTokens(Token.transaction_fee),
			tokenSymbol: Token.symbol,
			tokenLogo: undefined, // TODO
			tokenName: Token.name
		},
		governanceParameters: {
			neuronMaximumDissolveDelayBonus: mapPercentage(
				Voting.MaximumVotingPowerBonuses.DissolveDelay.bonus
			),
			neuronMaximumAgeForAgeBonus: mapDuration(Voting.MaximumVotingPowerBonuses.Age.duration),
			neuronMaximumDissolveDelay: mapDuration(
				Voting.MaximumVotingPowerBonuses.DissolveDelay.duration
			),
			neuronMinimumDissolveDelayToVote: mapDuration(Voting.minimum_dissolve_delay),
			neuronMaximumAgeBonus: mapPercentage(Voting.MaximumVotingPowerBonuses.Age.bonus),
			neuronMinimumStake: mapTokens(Neurons.minimum_creation_stake),
			proposalWaitForQuietDeadlineIncrease: mapDuration(
				Proposals.maximum_wait_for_quiet_deadline_extension
			),
			proposalInitialVotingPeriod: mapDuration(Proposals.initial_voting_period),
			proposalRejectionFee: mapTokens(Proposals.rejection_fee),
			votingRewardParameters: {
				rewardRateTransitionDuration: mapDuration(Voting.RewardRate.transition_duration),
				initialRewardRate: mapPercentage(Voting.RewardRate.initial),
				finalRewardRate: mapPercentage(Voting.RewardRate.final)
			}
		},
		fallbackControllerPrincipalIds,
		dappCanisters,
		swapParameters: {
			minimumParticipants: BigInt(Swap.minimum_participants),
			duration: mapDuration(Swap.duration),
			neuronBasketConstructionParameters: undefined,
			confirmationText: Swap.confirmation_text,
			maximumParticipantIcp: mapTokens(Swap.maximum_participant_icp)
		}
	};
};
