import { GOVERNANCE_CANISTER_ID } from '$lib/constants/app.constants';
import { userProposalsStore } from '$lib/stores/user-proposals.store';
import type { ProposalMetadataDoc } from '$lib/types/juno';
import { isNullish } from '@dfinity/utils';
import type { ListResults } from '@junobuild/core';
import { derived, type Readable } from 'svelte/store';

export const userProposalsICPStore: Readable<ListResults<ProposalMetadataDoc> | undefined | null> =
	derived(userProposalsStore, (data) => {
		if (isNullish(data)) {
			return data;
		}

		if (isNullish(GOVERNANCE_CANISTER_ID)) {
			return undefined;
		}

		return data[GOVERNANCE_CANISTER_ID];
	});
