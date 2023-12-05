import { GOVERNANCE_CANISTER_ID } from '$lib/constants/app.constants';
import { proposalsStore } from '$lib/stores/proposals.store';
import type { ProposalInfo } from '@dfinity/nns';
import { isNullish } from '@dfinity/utils';
import { derived, type Readable } from 'svelte/store';

export const proposalsICPStore: Readable<ProposalInfo[] | undefined | null> = derived(
	proposalsStore,
	(data) => {
		if (isNullish(data)) {
			return data;
		}

		if (isNullish(GOVERNANCE_CANISTER_ID)) {
			return undefined;
		}

		return data[GOVERNANCE_CANISTER_ID];
	}
);
