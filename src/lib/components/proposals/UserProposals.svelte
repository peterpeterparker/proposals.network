<script lang="ts">
	import SkeletonRows from '$lib/components/ui/SkeletonRows.svelte';
	import TableContainer from '$lib/components/ui/TableContainer.svelte';
	import Section from '$lib/components/ui/Section.svelte';
	import { userNotInitialized, userNotSignedIn } from '$lib/derived/user.derived';
	import { userStore } from '$lib/stores/user.store';
	import { loadUserProposals } from '$lib/services/loader.services';
	import { userProposalsStore } from '$lib/stores/user-proposals.store';
	import { userProposalsICPStore } from '$lib/derived/user-proposals.derived';
	import UserProposalRow from '$lib/components/proposals/UserProposalRow.svelte';

	const load = async () => {
		if ($userNotInitialized) {
			return;
		}

		if ($userNotSignedIn) {
			userProposalsStore.reset();
			return;
		}

		await loadUserProposals();
	};

	$: $userStore, (async () => load())();
</script>

<Section>
	<h2 class="text-6xl md:text-7xl mb-12 tracking-tight font-bold mx-4">Your proposals.</h2>

	<TableContainer rows={10}>
		<thead>
			<tr>
				<th>Key</th>
				<th>ID</th>
				<th>Title</th>
				<th>Topic</th>
				<th>Status</th>
				<th></th>
			</tr>
		</thead>

		<tbody>
			{#if $userProposalsICPStore === undefined}
				<SkeletonRows rows={10} columns={7} />
			{:else if $userProposalsICPStore === null}
				<tr>
					<td colspan="6">User not signed in.</td>
				</tr>
			{:else if $userProposalsICPStore.items_length === 0n}
				<tr>
					<td colspan="6">Empty.</td>
				</tr>
			{:else}
				{#each $userProposalsICPStore.items as doc}
					<UserProposalRow {doc} />
				{/each}
			{/if}
		</tbody>
	</TableContainer>
</Section>
