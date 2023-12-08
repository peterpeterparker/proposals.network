import en from '$lib/i18n/en.governance.json';
import { keyOf, keyOfOptional } from '$lib/utils/utils';
import type { Proposal } from '@dfinity/nns';
import { NnsFunction } from '@dfinity/nns';

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
	proposal: Proposal | undefined
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

export const getNnsFunctionKey = (proposal: Proposal | undefined): string | undefined => {
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

export const proposalFirstActionKey = (proposal: Proposal | undefined): string | undefined =>
	Object.keys(proposal?.action ?? {})[0];

export const proposalActionData = (proposal: Proposal): unknown | undefined => {
	const key = proposalFirstActionKey(proposal);
	if (key === undefined) {
		return {};
	}

	return (proposal.action as { [key: string]: unknown })?.[key];
};
