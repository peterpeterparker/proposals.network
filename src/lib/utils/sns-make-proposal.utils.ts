import { type NeuronSchema, type SnsYaml } from '$lib/types/sns';
import { formatToken } from '$lib/utils/token.utils';
import type { CreateServiceNervousSystem, Tokens } from '@dfinity/nns';
import type {
	Duration,
	GlobalTimeOfDay,
	NeuronDistribution,
	Percentage
} from '@dfinity/nns/dist/types/types/governance_converters';
import { convertStringToE8s, isNullish, nonNullish, TokenAmountV2 } from '@dfinity/utils';

interface UnitsToSeconds {
	seconds: number;
	second: number;
	sec: number;
	s: number;
	minutes: number;
	minute: number;
	min: number;
	m: number;
	hours: number;
	hour: number;
	hr: number;
	h: number;
	days: number;
	day: number;
	d: number;
	weeks: number;
	week: number;
	w: number;
	months: number;
	month: number;
	M: number;
	years: number;
	year: number;
	y: number;
}

type GovernanceUnitsToSeconds = Pick<
	UnitsToSeconds,
	'months' | 'month' | 'M' | 'years' | 'year' | 'y'
>;

// NNS and SNS seconds are different. See https://forum.dfinity.org/t/sns-yaml-month-and-year-conversion-to-seconds/32905.
const ONE_DAY_SECONDS = 24 * 60 * 60;
const ONE_YEAR_SECONDS = ((4 * 365 + 1) * ONE_DAY_SECONDS) / 4;
const ONE_MONTH_SECONDS = ONE_YEAR_SECONDS / 12;

// After debugging those number of seconds those not seem to be required.
// https://forum.dfinity.org/t/sns-yaml-month-and-year-conversion-to-seconds/32905/21?u=peterparker
const _nnsUnitsToSeconds: GovernanceUnitsToSeconds = {
	months: ONE_MONTH_SECONDS, // 2629800
	month: ONE_MONTH_SECONDS,
	M: ONE_MONTH_SECONDS,
	years: ONE_YEAR_SECONDS, // 2629800 * 12
	year: ONE_YEAR_SECONDS,
	y: ONE_YEAR_SECONDS
};

const snsUnitsToSeconds: GovernanceUnitsToSeconds = {
	months: 2_630_016, // 30.44d = 2_630_016
	month: 2_630_016,
	M: 2_630_016,
	years: 31_557_600, // 365.25d = 31_557_600
	year: 31_557_600,
	y: 31_557_600
};

const mapE8s = (value: string): Tokens => ({
	e8s: BigInt(value.toLowerCase().replace(/\s+/g, '').replace('e8s', '').replaceAll('_', '').trim())
});

const mapTokens = (value: string): Tokens => {
	const e8s = convertStringToE8s(
		value
			.toLowerCase()
			.replace(/\s+/g, '')
			.replace('e8s', '')
			.replace('tokens', '')
			.replace('token', '')
			.replaceAll('_', '')
			.trim()
	);

	if (typeof e8s === 'bigint') {
		return { e8s };
	}

	throw new Error(`Invalid ${value} to convert to tokens.`);
};

const mapE8sOrTokens = (input: string): Tokens => {
	const text = input.toLowerCase();

	if (text.includes('e8s')) {
		return mapE8s(text);
	}

	return mapTokens(text);
};

const mapPercentage = (percentage: string): Percentage => ({
	basisPoints: BigInt(Number(percentage.toLowerCase().replace('%', '').trim()) * 100)
});

const mapDuration = ({
	duration,
	governanceUnitsToSeconds
}: {
	duration: string;
	governanceUnitsToSeconds: GovernanceUnitsToSeconds;
}): Duration => {
	const unitsToSeconds: UnitsToSeconds = {
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
		...governanceUnitsToSeconds
	};

	const durationParts = duration.match(
		/\d+\s*(seconds?|sec|s|minutes?|min|m(?![o|O]|onths?)|hours?|hr|h|days?|d|weeks?|w|months?|M|years?|y)/g
	);

	if (isNullish(durationParts)) {
		throw new Error(`Invalid duration string: ${duration}`);
	}

	let totalSeconds = 0;

	durationParts.forEach((part) => {
		const matches = part.match(/\d+|\D+/g);

		if (isNullish(matches) || matches.length !== 2) {
			throw new Error(`Invalid duration part: ${duration} - ${part}`);
		}

		const [value, unit] = matches;
		totalSeconds +=
			parseInt(value) * (unitsToSeconds[unit.trim().toLowerCase() as keyof UnitsToSeconds] ?? 0);
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
	stake: mapE8sOrTokens(stake),
	dissolveDelay: mapDuration({
		duration: dissolve_delay,
		governanceUnitsToSeconds: snsUnitsToSeconds
	}),
	vestingPeriod: mapDuration({
		duration: vesting_period,
		governanceUnitsToSeconds: snsUnitsToSeconds
	})
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
		transactionFee: mapE8sOrTokens(Token.transaction_fee),
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
		neuronMaximumAgeForAgeBonus: mapDuration({
			duration: Voting.MaximumVotingPowerBonuses.Age.duration,
			governanceUnitsToSeconds: snsUnitsToSeconds
		}),
		neuronMaximumDissolveDelay: mapDuration({
			duration: Voting.MaximumVotingPowerBonuses.DissolveDelay.duration,
			governanceUnitsToSeconds: snsUnitsToSeconds
		}),
		neuronMinimumDissolveDelayToVote: mapDuration({
			duration: Voting.minimum_dissolve_delay,
			governanceUnitsToSeconds: snsUnitsToSeconds
		}),
		neuronMaximumAgeBonus: mapPercentage(Voting.MaximumVotingPowerBonuses.Age.bonus),
		neuronMinimumStake: mapE8sOrTokens(Neurons.minimum_creation_stake),
		proposalWaitForQuietDeadlineIncrease: mapDuration({
			duration: Proposals.maximum_wait_for_quiet_deadline_extension,
			governanceUnitsToSeconds: snsUnitsToSeconds
		}),
		proposalInitialVotingPeriod: mapDuration({
			duration: Proposals.initial_voting_period,
			governanceUnitsToSeconds: snsUnitsToSeconds
		}),
		proposalRejectionFee: mapE8sOrTokens(Proposals.rejection_fee),
		votingRewardParameters: {
			rewardRateTransitionDuration: mapDuration({
				duration: Voting.RewardRate.transition_duration,
				governanceUnitsToSeconds: snsUnitsToSeconds
			}),
			initialRewardRate: mapPercentage(Voting.RewardRate.initial),
			finalRewardRate: mapPercentage(Voting.RewardRate.final)
		}
	},
	fallbackControllerPrincipalIds,
	dappCanisters,
	swapParameters: {
		minimumParticipants: BigInt(Swap.minimum_participants),
		duration: mapDuration({
			duration: Swap.duration,
			governanceUnitsToSeconds: snsUnitsToSeconds
		}),
		neuronBasketConstructionParameters: {
			count: BigInt(Swap.VestingSchedule.events),
			dissolveDelayInterval: mapDuration({
				duration: Swap.VestingSchedule.interval,
				governanceUnitsToSeconds: snsUnitsToSeconds
			})
		},
		confirmationText: Swap.confirmation_text,
		maximumParticipantIcp: mapE8sOrTokens(Swap.maximum_participant_icp),
		neuronsFundInvestmentIcp: undefined,
		minimumIcp: undefined,
		minimumParticipantIcp: mapE8sOrTokens(Swap.minimum_participant_icp),
		startTime: nonNullish(Swap.start_time) ? mapTimeOfDay(Swap.start_time) : undefined,
		maximumIcp: undefined,
		restrictedCountries: nonNullish(Swap.restricted_countries)
			? {
					isoCodes: Swap.restricted_countries
				}
			: undefined,
		maxDirectParticipationIcp: mapE8sOrTokens(Swap.maximum_direct_participation_icp),
		minDirectParticipationIcp: mapE8sOrTokens(Swap.minimum_direct_participation_icp),
		neuronsFundParticipation: Swap.neurons_fund_participation
	},
	initialTokenDistribution: {
		swapDistribution: {
			total: mapE8sOrTokens(Distribution.InitialBalances.swap)
		},
		treasuryDistribution: {
			total: mapE8sOrTokens(Distribution.InitialBalances.governance)
		},
		developerDistribution: {
			developerNeurons: Distribution.Neurons.map(mapNeuron)
		}
	}
});

export const mapSnsYamlForContent = (
	yaml: SnsYaml
): {
	minimumParticipantIcp: string;
	maximumParticipantIcp: string;
	minDirectParticipationIcp: string;
	maxDirectParticipationIcp: string;
	swapDistribution: string;
	treasuryDistribution: string;
	developersDistribution: string;
} => {
	const { swapParameters, initialTokenDistribution } = mapSnsYamlToCreateServiceNervousSystem({
		yaml,
		logo: ''
	});

	const snsToken = {
		symbol: yaml.Token.symbol,
		name: yaml.Token.name,
		decimals: 8
	};

	const ICPToken = {
		symbol: 'ICP',
		name: 'Internet Computer',
		decimals: 8
	};

	const BLANK = '__________________';

	const minimumParticipantIcp = nonNullish(swapParameters?.minimumParticipantIcp?.e8s)
		? formatToken(
				TokenAmountV2.fromUlps({
					amount: swapParameters.minimumParticipantIcp.e8s,
					token: ICPToken
				})
			)
		: BLANK;
	const maximumParticipantIcp = nonNullish(swapParameters?.maximumParticipantIcp?.e8s)
		? formatToken(
				TokenAmountV2.fromUlps({
					amount: swapParameters.maximumParticipantIcp.e8s,
					token: ICPToken
				})
			)
		: BLANK;

	const minDirectParticipationIcp = nonNullish(swapParameters?.minDirectParticipationIcp?.e8s)
		? formatToken(
				TokenAmountV2.fromUlps({
					amount: swapParameters.minDirectParticipationIcp.e8s,
					token: ICPToken
				})
			)
		: BLANK;
	const maxDirectParticipationIcp = nonNullish(swapParameters?.maxDirectParticipationIcp?.e8s)
		? formatToken(
				TokenAmountV2.fromUlps({
					amount: swapParameters.maxDirectParticipationIcp.e8s,
					token: ICPToken
				})
			)
		: BLANK;

	const swapDistribution = initialTokenDistribution?.swapDistribution?.total?.e8s;
	const treasuryDistribution = initialTokenDistribution?.treasuryDistribution?.total?.e8s;
	const developersDistribution = initialTokenDistribution?.developerDistribution?.developerNeurons
		.map((neuron) => neuron.stake?.e8s)
		.filter(nonNullish)
		.reduce((acc, e8s) => acc + e8s, 0n);

	return {
		minimumParticipantIcp,
		maximumParticipantIcp,
		minDirectParticipationIcp,
		maxDirectParticipationIcp,
		swapDistribution: nonNullish(swapDistribution)
			? formatToken(
					TokenAmountV2.fromUlps({
						amount: swapDistribution,
						token: snsToken
					})
				)
			: BLANK,
		treasuryDistribution: nonNullish(treasuryDistribution)
			? formatToken(
					TokenAmountV2.fromUlps({
						amount: treasuryDistribution,
						token: snsToken
					})
				)
			: BLANK,
		developersDistribution: nonNullish(developersDistribution)
			? formatToken(
					TokenAmountV2.fromUlps({
						amount: developersDistribution,
						token: snsToken
					})
				)
			: BLANK
	};
};
