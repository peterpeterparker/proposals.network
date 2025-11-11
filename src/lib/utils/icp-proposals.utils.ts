import { ICP_NEURON_URL } from '$lib/constants/dashboard.constants';
import en from '$lib/i18n/en.governance.json';
import type { Proposal } from '$lib/types/governance';
import { keyOf, keyOfOptional } from '$lib/utils/utils';
import type { ProposalInfo } from '@dfinity/nns';
import {
	NnsFunction,
	ProposalRewardStatus,
	ProposalStatus,
	Topic,
	type Proposal as ProposalNns
} from '@dfinity/nns';
import { nonNullish } from '@dfinity/utils';

export type ProposalInfoMap = {
	type: string | undefined;
	typeDescription: string | undefined;
};

/**
 * If the action is a ExecuteNnsFunction, then we map the NNS function id (its detailed label).
 * Otherwise, we map the action function itself.
 *
 * This outcome is called "the proposal type".
 */
export const mapProposalType = (
	proposal: ProposalNns | undefined
): Pick<ProposalInfoMap, 'type' | 'typeDescription'> => {
	const { actions, actions_description, nns_functions, nns_functions_description } = en;

	const NO_MATCH = { type: undefined, typeDescription: undefined };

	if (proposal === undefined) {
		return NO_MATCH;
	}

	const nnsFunctionKey: string | undefined = getNnsFunctionKey(proposal);

	if (nnsFunctionKey !== undefined) {
		return {
			type: keyOf({ obj: nns_functions, key: nnsFunctionKey }),
			typeDescription: keyOf({
				obj: nns_functions_description,
				key: nnsFunctionKey
			})
		};
	}

	const action: string | undefined = proposalFirstActionKey(proposal);

	return action !== undefined
		? {
				type: keyOf({ obj: actions, key: action }),
				typeDescription: keyOf({ obj: actions_description, key: action })
			}
		: NO_MATCH;
};

export const getNnsFunctionKey = (proposal: ProposalNns | undefined): string | undefined => {
	const action = proposalFirstActionKey(proposal);

	if (action !== 'ExecuteNnsFunction') {
		return undefined;
	}

	// 0 equals Unspecified
	const { nnsFunctionId } = keyOfOptional({
		obj: proposal?.action,
		key: action
	}) ?? {
		nnsFunctionId: 0
	};

	return NnsFunction[nnsFunctionId];
};

export const proposalFirstActionKey = (proposal: ProposalNns | undefined): string | undefined =>
	Object.keys(proposal?.action ?? {})[0];

export const proposalActionData = (proposal: ProposalNns): unknown | undefined => {
	const key = proposalFirstActionKey(proposal);
	if (key === undefined) {
		return {};
	}

	return (proposal.action as { [key: string]: unknown })?.[key];
};

export const mapIcpProposal = ({
	id,
	deadlineTimestampSeconds,
	proposalTimestampSeconds,
	decidedTimestampSeconds,
	executedTimestampSeconds,
	failedTimestampSeconds,
	proposal,
	topic,
	status,
	rewardStatus,
	latestTally,
	proposer
}: ProposalInfo): Proposal => {
	const actionKey = nonNullish(proposal) ? proposalFirstActionKey(proposal) : undefined;
	const actionData = nonNullish(proposal) ? proposalActionData(proposal) : {};

	return {
		id,
		deadlineTimestampSeconds,
		proposalTimestampSeconds,
		decidedTimestampSeconds,
		executedTimestampSeconds,
		failedTimestampSeconds,
		title: proposal?.title,
		summary: proposal?.summary,
		url: proposal?.url,
		proposer: nonNullish(proposer)
			? {
					id: proposer,
					url: `${ICP_NEURON_URL}/${proposer}`
				}
			: undefined,
		...mapProposalType(proposal),
		topic: keyOf({ obj: en.topics, key: Topic[topic] }),
		status: keyOf({ obj: en.status, key: ProposalStatus[status] }),
		rewardStatus: keyOf({ obj: en.rewards, key: ProposalRewardStatus[rewardStatus] }),
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
