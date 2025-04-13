import { SNS_NEURON_URL } from '$lib/constants/dashboard.constants';
import en from '$lib/i18n/en.governance.json';
import type { Proposal } from '$lib/types/governance';
import type { CachedFunctionTypeDto, CachedNervousFunctionDto } from '$lib/types/sns-aggregator';
import { nowInSeconds } from '$lib/utils/date.utils';
import { keyOf } from '$lib/utils/utils';
import { Vote } from '@dfinity/nns';
import { Principal } from '@dfinity/principal';
import {
	SnsProposalDecisionStatus,
	SnsProposalRewardStatus,
	type SnsFunctionType,
	type SnsNervousSystemFunction,
	type SnsPercentage,
	type SnsProposalData
} from '@dfinity/sns';
import type { NeuronId, ProposalData, Topic } from '@dfinity/sns/dist/candid/sns_governance';
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

const convertOptionalStringToGenericNervousSystemFunctionTopic = (
	value: string | null
): [Topic] | [] => {
	if (isNullish(value)) {
		return toNullable();
	}

	switch (value) {
		case 'DappCanisterManagement':
			return toNullable({ DappCanisterManagement: null });
		case 'DaoCommunitySettings':
			return toNullable({ DaoCommunitySettings: null });
		case 'ApplicationBusinessLogic':
			return toNullable({ ApplicationBusinessLogic: null });
		case 'CriticalDappOperations':
			return toNullable({ CriticalDappOperations: null });
		case 'TreasuryAssetManagement':
			return toNullable({ TreasuryAssetManagement: null });
		case 'Governance':
			return toNullable({ Governance: null });
		case 'SnsFrameworkManagement':
			return toNullable({ SnsFrameworkManagement: null });
	}

	throw new Error('Unknown GenericNervousSystemFunction.Topic to decode proposal.');
};

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
			target_method_name: toNullable(GenericNervousSystemFunction.target_method_name),
			topic: convertOptionalStringToGenericNervousSystemFunctionTopic(
				GenericNervousSystemFunction.topic
			)
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
 * Returns the status of a proposal based on the data.
 *
 * Reference: https://github.com/dfinity/ic/blob/226ab04e0984367da356bbe27c90447863d33a27/rs/sns/governance/src/proposal.rs#L735
 *
 * @param {SnsProposalData} proposal
 * @returns {SnsProposalRewardStatus}
 */
export const snsRewardStatus = ({
	reward_event_round,
	wait_for_quiet_state,
	is_eligible_for_rewards
}: SnsProposalData): SnsProposalRewardStatus => {
	if (reward_event_round > BigInt(0)) {
		return SnsProposalRewardStatus.PROPOSAL_REWARD_STATUS_SETTLED;
	}

	const now = nowInSeconds();
	const deadline = fromNullable(wait_for_quiet_state)?.current_deadline_timestamp_seconds;
	if (!deadline) {
		// Reference: https://github.com/dfinity/ic/blob/226ab04e0984367da356bbe27c90447863d33a27/rs/sns/governance/src/proposal.rs#L760
		throw new Error('Proposal must have a wait_for_quiet_state.');
	}
	if (now < deadline) {
		return SnsProposalRewardStatus.PROPOSAL_REWARD_STATUS_ACCEPT_VOTES;
	}

	if (is_eligible_for_rewards) {
		return SnsProposalRewardStatus.PROPOSAL_REWARD_STATUS_READY_TO_SETTLE;
	}
	return SnsProposalRewardStatus.PROPOSAL_REWARD_STATUS_SETTLED;
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

const bytesToHexString = (bytes: number[]): string =>
	bytes.reduce((str, byte) => `${str}${byte.toString(16).padStart(2, '0')}`, '');

const subaccountToHexString = (subaccount: Uint8Array | number[]): string =>
	bytesToHexString(Array.from(subaccount));

const getSnsNeuronIdAsHexString = (neuronId: NeuronId | undefined): string =>
	subaccountToHexString(neuronId?.id ?? new Uint8Array());

export const mapSnsProposal = ({
	proposal: proposalData,
	nsFunctions,
	rootCanisterId
}: {
	proposal: ProposalData;
	nsFunctions: SnsNervousSystemFunction[] | undefined;
	rootCanisterId: string | undefined | null;
}): Proposal => {
	const {
		id,
		reward_event_end_timestamp_seconds,
		proposal,
		action,
		latest_tally,
		proposer,
		proposal_creation_timestamp_seconds: proposalTimestampSeconds,
		decided_timestamp_seconds: decidedTimestampSeconds,
		executed_timestamp_seconds: executedTimestampSeconds,
		failed_timestamp_seconds: failedTimestampSeconds
	} = proposalData;

	const proposalInfo = fromNullable(proposal);
	const actionData = proposalInfo !== undefined ? fromNullable(proposalInfo.action) : undefined;

	const nsFunction = nsFunctions?.find(({ id }) => id === action);

	const rewardStatus = snsRewardStatus(proposalData);
	const decisionStatus = snsDecisionStatus(proposalData);

	const latestTally = fromNullable(latest_tally);

	const optionProposer = fromNullable(proposer);
	const proposerId = nonNullish(optionProposer)
		? getSnsNeuronIdAsHexString(optionProposer)
		: undefined;

	// ExecuteGenericNervousSystemFunction currently not supported
	const actionKey = keyOf({ obj: en.sns_action, key: `${action}` });

	return {
		id: fromNullable(id)?.id,
		deadlineTimestampSeconds: fromNullable(reward_event_end_timestamp_seconds),
		proposalTimestampSeconds,
		decidedTimestampSeconds,
		executedTimestampSeconds,
		failedTimestampSeconds,
		title: fromNullable(proposal)?.title,
		summary: fromNullable(proposal)?.summary,
		url: fromNullable(proposal)?.url,
		proposer: nonNullish(proposerId)
			? {
					id: proposerId,
					url: nonNullish(rootCanisterId)
						? SNS_NEURON_URL.replace('{rootCanisterId}', rootCanisterId).replace(
								'{neuronId}',
								proposerId
							)
						: undefined
				}
			: undefined,
		type: nsFunction?.name,
		typeDescription: nsFunction?.description[0],
		status: en.sns_status[decisionStatus],
		rewardStatus: en.sns_rewards_status[rewardStatus],
		...(nonNullish(latestTally) && {
			latestTally
		}),
		...(nonNullish(actionKey) && {
			action: {
				key: actionKey,
				data: actionData
			}
		})
	};
};
