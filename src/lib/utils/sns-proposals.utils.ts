import en from '$lib/i18n/en.governance.json';
import type { Proposal } from '$lib/types/governance';
import type { CachedFunctionTypeDto, CachedNervousFunctionDto } from '$lib/types/sns-aggregator';
import { Vote } from '@dfinity/nns';
import { Principal } from '@dfinity/principal';
import {
	SnsProposalDecisionStatus,
	type SnsFunctionType,
	type SnsNervousSystemFunction,
	type SnsPercentage,
	type SnsProposalData
} from '@dfinity/sns';
import type { ProposalData } from '@dfinity/sns/dist/candid/sns_governance';
import { fromNullable, isNullish, nonNullish, toNullable } from '@dfinity/utils';

export const convertNervousFunction = ({
	id,
	name,
	description,
	function_type
}: CachedNervousFunctionDto): SnsNervousSystemFunction => ({
	id: BigInt(id),
	name: name,
	description: toNullable(description),
	function_type: nonNullish(function_type) ? toNullable(convertFunctionType(function_type)) : []
});

const convertFunctionType = (functionType: CachedFunctionTypeDto): SnsFunctionType => {
	if ('NativeNervousSystemFunction' in functionType) {
		return { NativeNervousSystemFunction: {} };
	}
	const { GenericNervousSystemFunction } = functionType;
	return {
		GenericNervousSystemFunction: {
			validator_canister_id: convertOptionalStringToOptionalPrincipal(
				GenericNervousSystemFunction.validator_canister_id
			),
			target_canister_id: convertOptionalStringToOptionalPrincipal(
				GenericNervousSystemFunction.target_canister_id
			),
			validator_method_name: toNullable(GenericNervousSystemFunction.validator_method_name),
			target_method_name: toNullable(GenericNervousSystemFunction.target_method_name)
		}
	};
};

const convertOptionalStringToOptionalPrincipal = (
	principalText: string | null | undefined
): [] | [Principal] => {
	return isNullish(principalText) ? [] : [Principal.fromText(principalText)];
};

/**
 * Returns the decision status of a proposal based on the data.
 *
 * Refecence: https://github.com/dfinity/ic/blob/226ab04e0984367da356bbe27c90447863d33a27/rs/sns/governance/src/proposal.rs#L717
 * @param {SnsProposalData} proposal
 * @returns {SnsProposalDecisionStatus}
 */
export const snsDecisionStatus = (proposal: SnsProposalData): SnsProposalDecisionStatus => {
	const { decided_timestamp_seconds, executed_timestamp_seconds, failed_timestamp_seconds } =
		proposal;
	if (decided_timestamp_seconds === BigInt(0)) {
		return SnsProposalDecisionStatus.PROPOSAL_DECISION_STATUS_OPEN;
	}

	if (isAccepted(proposal)) {
		if (executed_timestamp_seconds > BigInt(0)) {
			return SnsProposalDecisionStatus.PROPOSAL_DECISION_STATUS_EXECUTED;
		}
		if (failed_timestamp_seconds > BigInt(0)) {
			return SnsProposalDecisionStatus.PROPOSAL_DECISION_STATUS_FAILED;
		}
		return SnsProposalDecisionStatus.PROPOSAL_DECISION_STATUS_ADOPTED;
	}

	return SnsProposalDecisionStatus.PROPOSAL_DECISION_STATUS_REJECTED;
};

/**
 * Returns whether the proposal is accepted or not based on the data.
 *
 * Reference: https://github.com/dfinity/ic/blob/dc2c20b26eaddb459698e4f9a30e521c21fb3d6e/rs/sns/governance/src/proposal.rs#L1095
 * @param {SnsProposalData} proposal
 * @returns {boolean}
 */
export const isAccepted = (proposal: SnsProposalData): boolean => {
	const { latest_tally } = proposal;
	const tally = fromNullable(latest_tally);

	if (tally === undefined) {
		return false;
	}

	const { yes, no, total } = tally;
	const majorityMet =
		majorityDecision({
			yes,
			no,
			total: yes + no,
			requiredYesOfTotalBasisPoints: minimumYesProportionOfExercised(proposal)
		}) == Vote.Yes;
	const quorumMet = yes * 10_000n >= total * minimumYesProportionOfTotal(proposal);

	return quorumMet && majorityMet;
};

/**
 * 3 % - default value for nns and sns proposals.
 * Reference: https://github.com/dfinity/ic/blob/dc2c20b26eaddb459698e4f9a30e521c21fb3d6e/rs/sns/governance/src/types.rs#L378
 */
export const MINIMUM_YES_PROPORTION_OF_TOTAL_VOTING_POWER = 300n;
/**
 * 50 % - default value for nns and sns proposals.
 * Reference: https://github.com/dfinity/ic/blob/dc2c20b26eaddb459698e4f9a30e521c21fb3d6e/rs/sns/governance/src/types.rs#L385
 */
export const MINIMUM_YES_PROPORTION_OF_EXERCISED_VOTING_POWER = 5_000n;

const fromPercentageBasisPoints = (value: [] | [SnsPercentage]): bigint | undefined => {
	const percentage = fromNullable(value);
	return isNullish(percentage) ? undefined : fromNullable(percentage.basis_points);
};

export const minimumYesProportionOfTotal = (proposal: SnsProposalData): bigint =>
	// `minimum_yes_proportion_of_total` property could be missing in older canister versions
	fromPercentageBasisPoints(proposal.minimum_yes_proportion_of_total ?? []) ??
	MINIMUM_YES_PROPORTION_OF_TOTAL_VOTING_POWER;

export const minimumYesProportionOfExercised = (proposal: SnsProposalData): bigint =>
	// `minimum_yes_proportion_of_exercised` property could be missing in older canister versions
	fromPercentageBasisPoints(proposal.minimum_yes_proportion_of_exercised ?? []) ??
	MINIMUM_YES_PROPORTION_OF_EXERCISED_VOTING_POWER;

// Considers the amount of 'yes' and 'no' voting power in relation to the total voting power,
// based on a percentage threshold that must be met or exceeded for a decision.
// Reference: https://gitlab.com/dfinity-lab/public/ic/-/blob/8db486b531b2993dad9c6eed015f34fc2378fc3e/rs/sns/governance/src/proposal.rs#L1239
const majorityDecision = ({
	yes,
	no,
	total,
	requiredYesOfTotalBasisPoints
}: {
	yes: bigint;
	no: bigint;
	total: bigint;
	requiredYesOfTotalBasisPoints: bigint;
}): Vote => {
	// 10_000n is 100% in basis points
	const requiredNoOfTotalBasisPoints = 10_000n - requiredYesOfTotalBasisPoints;

	if (yes * 10_000n > total * requiredYesOfTotalBasisPoints) {
		return Vote.Yes;
	} else if (no * 10_000n >= total * requiredNoOfTotalBasisPoints) {
		return Vote.No;
	} else {
		return Vote.Unspecified;
	}
};

export const mapSnsProposal = ({
	proposal: proposalData,
	nsFunctions
}: {
	proposal: ProposalData;
	nsFunctions: SnsNervousSystemFunction[] | undefined;
}): Proposal => {
	const { id, reward_event_end_timestamp_seconds, proposal, action, latest_tally } = proposalData;

	const nsFunction = nsFunctions?.find(({ id }) => id === action);

	const decisionStatus = snsDecisionStatus(proposalData);

	const latestTally = fromNullable(latest_tally);

	return {
		id: fromNullable(id)?.id,
		deadlineTimestampSeconds: fromNullable(reward_event_end_timestamp_seconds),
		title: fromNullable(proposal)?.title,
		type: nsFunction?.name,
		typeDescription: nsFunction?.description[0],
		status: en.sns_status[decisionStatus],
		...(nonNullish(latestTally) && {
			vote: {
				...latestTally
			}
		})
	};
};
