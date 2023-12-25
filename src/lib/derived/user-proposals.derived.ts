import { routeGovernanceId } from '$lib/derived/nav.derived';
import { userProposalsStore } from '$lib/stores/user-proposals.store';
import type { ProposalMetadataDoc } from '$lib/types/juno';
import { isNullish } from '@dfinity/utils';
import type { ListResults } from '@junobuild/core-peer';
import { derived, type Readable } from 'svelte/store';

export const userGovernanceProposalsStore: Readable<
	ListResults<ProposalMetadataDoc> | undefined | null
> = derived(
	[userProposalsStore, routeGovernanceId],
	([$userProposalsStore, $routeGovernanceId]) => {
		if (isNullish($userProposalsStore)) {
			return $userProposalsStore;
		}

		if (isNullish($routeGovernanceId)) {
			return undefined;
		}

		return $userProposalsStore[$routeGovernanceId];
	}
);
