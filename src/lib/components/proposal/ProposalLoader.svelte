<script lang="ts">
	import { isNullish, nonNullish } from '@dfinity/utils';
	import { routeProposalId } from '$lib/derived/nav.derived';
	import { back } from '$lib/utils/nav.utils';
	import { selectedProposalsStore } from '$lib/derived/proposals.derived';
	import { toasts } from '$lib/stores/toasts.store';
	import SpinnerScreen from '$lib/components/ui/SpinnerScreen.svelte';
	import { blur } from 'svelte/transition';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import type { ProposalContext, ProposalStoreData } from '$lib/types/proposal.context';
	import { PROPOSAL_CONTEXT_KEY } from '$lib/types/proposal.context';
	import { getProposal } from '$lib/services/proposal.services';
	import { governanceIdStore, governanceTypeStore } from '$lib/derived/governance.derived';

	const proposalStore = writable<ProposalStoreData>(undefined);

	const reset = () => proposalStore.set(null);

	setContext<ProposalContext>(PROPOSAL_CONTEXT_KEY, {
		store: proposalStore,
		reset
	});

	const load = async () => {
		if (isNullish($routeProposalId) || $routeProposalId === '') {
			await back(false);
			return;
		}

		const proposalInfo = $selectedProposalsStore?.find(
			({ id }) => nonNullish(id) && `${id}` === $routeProposalId
		);

		if (nonNullish(proposalInfo)) {
			proposalStore.set({ proposal: proposalInfo });
			return;
		}

		try {
			const newProposal = await getProposal({
				proposalId: BigInt($routeProposalId),
				governanceCanisterId: $governanceIdStore,
				type: $governanceTypeStore
			});

			if (isNullish(newProposal)) {
				toasts.error({
					msg: { text: `Proposal not found: ${$routeProposalId}`, duration: 2000 }
				});

				await back(false);
				return;
			}

			proposalStore.set({ proposal: newProposal });
		} catch (err: unknown) {
			toasts.error({
				msg: { text: `Unexpected error while loading the network proposal: ${$routeProposalId}` },
				err
			});

			await back(false);
			return;
		}
	};

	$: $routeProposalId, (async () => load())();
</script>

{#if isNullish($proposalStore?.proposal)}
	<SpinnerScreen />
{:else}
	<div in:blur>
		<slot />
	</div>
{/if}
