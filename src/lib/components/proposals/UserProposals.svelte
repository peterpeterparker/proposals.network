<script lang="ts">
	import SkeletonRows from '$lib/components/ui/SkeletonRows.svelte';
	import TableContainer from '$lib/components/ui/TableContainer.svelte';
	import Section from '$lib/components/ui/Section.svelte';
	import { userProposalsStore } from '$lib/stores/user-proposals.store';
	import UserProposalRow from '$lib/components/proposals/UserProposalRow.svelte';
	import GovernanceSubmitLink from '$lib/components/governance/GovernanceSubmitLink.svelte';
	import UserProposalPaginator from '$lib/components/proposals/UserProposalPaginator.svelte';
	import { fade } from 'svelte/transition';
	import { USER_PAGINATION } from '$lib/constants/app.constants';
	import SignIn from '$lib/components/core/SignIn.svelte';
	import UserProposalsLoader from '$lib/components/proposals/UserProposalsLoader.svelte';
</script>

<UserProposalsLoader>
	<Section>
		<h2 class="text-6xl md:text-7xl md:leading-tight mb-12 tracking-tight font-bold lg:mx-4">
			Your proposals
		</h2>

		<TableContainer rows={$userProposalsStore?.items.length}>
			<thead>
				<tr>
					<th class="w-2/12">Key</th>
					<th class="w-2/12">Governance</th>
					<th class="w-1/12">ID</th>
					<th class="max-w-lg">Title</th>
					<th class="w-1/12">Status</th>
					<th></th>
				</tr>
			</thead>

			<tbody>
				{#if $userProposalsStore === undefined}
					<SkeletonRows rows={USER_PAGINATION} columns={7} />
				{:else if $userProposalsStore === null}
					<tr>
						<td colspan="6">
							<span class="inline-block">Sign-in to submit your own proposals.</span>
						</td>
					</tr>
				{:else if $userProposalsStore.items_length === 0n}
					<tr>
						<td colspan="6">
							<span class="inline-block"
								>Your basket of ideas is empty. Start crafting your first proposal now!</span
							>
						</td>
					</tr>
				{:else}
					{#each $userProposalsStore.items as doc (doc.key)}
						<UserProposalRow {doc} />
					{/each}
				{/if}
			</tbody>
		</TableContainer>

		<div id="your-proposals-actions">
			{#if $userProposalsStore === null}
				<div in:fade class="lg:mx-4 my-4">
					<SignIn color="quaternary" />
				</div>
			{:else if $userProposalsStore?.items_length === 0n}
				<div in:fade class="lg:mx-4 my-4">
					<GovernanceSubmitLink />
				</div>
			{:else}
				<UserProposalPaginator />
			{/if}
		</div>
	</Section>
</UserProposalsLoader>
