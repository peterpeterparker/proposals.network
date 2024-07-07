import { type NeuronSchema, type SnsYaml } from '$lib/types/sns';
import type { CreateServiceNervousSystem, Tokens } from '@dfinity/nns';
import type {
	Duration,
	GlobalTimeOfDay,
	NeuronDistribution,
	Percentage
} from '@dfinity/nns/dist/types/types/governance_converters';
import { isNullish, nonNullish } from '@dfinity/utils';

const mapTokens = (value: string): Tokens => ({
	e8s: BigInt(
		value
			.toLowerCase()
			.replace('e8s', '')
			.replace('tokens', '')
			.replace('token', '')
			.replaceAll('_', '')
			.trim()
	)
});

const mapPercentage = (percentage: string): Percentage => ({
	basisPoints: BigInt(Number(percentage.toLowerCase().replace('%', '').trim()) * 100)
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

const mapTimeOfDay = (timeOfDay: string): GlobalTimeOfDay => {
	const [hours, minutes] = timeOfDay.split(' ')[0].split(':').map(Number);

	return {
		secondsAfterUtcMidnight: BigInt(hours * 3600 + minutes * 60)
	};
};

const mapNeuron = ({
	principal,
	memo,
	stake,
	dissolve_delay,
	vesting_period
}: NeuronSchema): NeuronDistribution => ({
	controller: principal,
	memo: BigInt(memo),
	stake: mapTokens(stake),
	dissolveDelay: mapDuration(dissolve_delay),
	vestingPeriod: mapDuration(vesting_period)
});

// Map source: https://github.com/dfinity/ic/blob/17df8febdb922c3981475035d830f09d9b990a5a/rs/registry/admin/src/main.rs#L2592
export const mapSnsYamlToCreateServiceNervousSystem = ({
	yaml: {
		name,
		description,
		url,
		Token,
		Voting,
		Proposals,
		Neurons,
		fallback_controller_principals: fallbackControllerPrincipalIds,
		dapp_canisters: dappCanisters,
		Swap,
		Distribution
	},
	logo
}: {
	yaml: SnsYaml;
	logo: string;
}): CreateServiceNervousSystem => ({
	name,
	url,
	description,
	logo: {
		base64Encoding: logo
	},
	ledgerParameters: {
		transactionFee: mapTokens(Token.transaction_fee),
		tokenSymbol: Token.symbol,
		tokenLogo: {
			base64Encoding: logo
		},
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
		maximumParticipantIcp: mapTokens(Swap.maximum_participant_icp),
		neuronsFundInvestmentIcp: undefined,
		minimumIcp: undefined,
		minimumParticipantIcp: mapTokens(Swap.minimum_participant_icp),
		startTime: nonNullish(Swap.start_time) ? mapTimeOfDay(Swap.start_time) : undefined,
		maximumIcp: undefined,
		restrictedCountries: nonNullish(Swap.restricted_countries)
			? {
					isoCodes: Swap.restricted_countries
				}
			: undefined,
		maxDirectParticipationIcp: mapTokens(Swap.maximum_direct_participation_icp),
		minDirectParticipationIcp: mapTokens(Swap.minimum_direct_participation_icp),
		neuronsFundParticipation: Swap.neurons_fund_participation
	},
	initialTokenDistribution: {
		swapDistribution: {
			total: mapTokens(Distribution.InitialBalances.swap)
		},
		treasuryDistribution: {
			total: mapTokens(Distribution.InitialBalances.governance)
		},
		developerDistribution: {
			developerNeurons: Distribution.Neurons.map(mapNeuron)
		}
	}
});
