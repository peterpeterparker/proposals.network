<script lang="ts">
	import TableContainer from '$lib/components/ui/TableContainer.svelte';
	import SkeletonRows from '$lib/components/ui/SkeletonRows.svelte';
	import Section from '$lib/components/ui/Section.svelte';
	import { loadProposals } from '$lib/services/loader-stores.services';
	import {
		type IntersectingDetail,
		onIntersectionTitle
	} from '$lib/directives/intersection.directives';
	import { NETWORK_PAGINATION } from '$lib/constants/app.constants';
	import { proposalsICPStore } from '$lib/derived/proposals.derived';
	import { isNullish } from '@dfinity/utils';
	import ProposalRow from '$lib/components/proposals/ProposalRow.svelte';
	import ProposalPaginator from '$lib/components/proposals/ProposalPaginator.svelte';
	import ProposalOpen from '$lib/components/proposals/ProposalOpen.svelte';
	import GovernanceSelector from "$lib/components/core/GovernanceSelector.svelte";

	let intersecting = false;
	export const onTitleIntersection = ($event: Event) => {
		const {
			detail: { intersecting: i }
		} = $event as unknown as CustomEvent<IntersectingDetail>;

		intersecting = i;
	};

	let fetchedOnce = false;

	const load = async () => {
		if (fetchedOnce) {
			return;
		}

		fetchedOnce = true;

		await loadProposals({ beforeProposal: undefined });
	};

	$: intersecting, (async () => load())();


</script>

<Section color="secondary">
	<h2
		class="text-6xl md:text-7xl mb-12 tracking-tight font-bold lg:mx-4"
		use:onIntersectionTitle
		on:pnwrkIntersecting={onTitleIntersection}
	>
		Network
	</h2>

	<div class="lg:mx-4 mb-4">
		<GovernanceSelector />
	</div>

	<TableContainer rows={$proposalsICPStore?.length} color="secondary">
		<thead>
			<tr>
				<th class="md:w-[140px]">ID</th>
				<th class="md:w-[30%]">Title</th>
				<th>Topic</th>
				<th>Status</th>
				<th>Yes</th>
				<th class="xl:w-[200px]">Expiration</th>
				<th></th>
			</tr>
		</thead>

		<tbody>
			{#if isNullish($proposalsICPStore)}
				<SkeletonRows rows={NETWORK_PAGINATION} columns={8} />
			{:else if $proposalsICPStore.length === 0}
				<tr>
					<td colspan="7">
						<span class="inline-block">No matching proposals found for now!</span>
					</td>
				</tr>
			{:else}
				{#each $proposalsICPStore as proposalInfo (proposalInfo.id)}
					<ProposalRow {proposalInfo} />
				{/each}
			{/if}
		</tbody>
	</TableContainer>

	<ProposalPaginator />

	<ProposalOpen />
</Section>
