<script lang="ts">
	import SkeletonRows from '$lib/components/ui/SkeletonRows.svelte';
	import TableContainer from '$lib/components/ui/TableContainer.svelte';
	import Section from '$lib/components/ui/Section.svelte';
	import { userNotInitialized, userNotSignedIn } from '$lib/derived/user.derived';
	import { userStore } from '$lib/stores/user.store';
	import { loadUserProposals } from '$lib/services/loader-stores.services';
	import { userProposalsStore } from '$lib/stores/user-proposals.store';
	import { userProposalsICPStore } from '$lib/derived/user-proposals.derived';
	import UserProposalRow from '$lib/components/proposals/UserProposalRow.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { signIn } from '$lib/services/auth.services';
	import IconICMonochrome from '$lib/components/icons/IconICMonochrome.svelte';
	import SubmitLink from '$lib/components/submit/SubmitLink.svelte';
	import UserProposalPaginator from '$lib/components/proposals/UserProposalPaginator.svelte';
	import { fade } from 'svelte/transition';
	import { USER_PAGINATION } from '$lib/constants/app.constants';

	const load = async () => {
		if ($userNotInitialized) {
			return;
		}

		if ($userNotSignedIn) {
			userProposalsStore.reset();
			return;
		}

		await loadUserProposals({ startAfter: undefined });
	};

	$: $userStore, (async () => load())();
</script>

<Section>
	<h2 class="text-6xl md:text-7xl mb-12 tracking-tight font-bold lg:mx-4">Your proposals</h2>

	<TableContainer rows={$userProposalsICPStore?.items.length}>
		<thead>
			<tr>
				<th class="w-2/12">Key</th>
				<th class="w-1/12">ID</th>
				<th class="max-w-lg">Title</th>
				<th class="w-1/12">Status</th>
				<th></th>
			</tr>
		</thead>

		<tbody>
			{#if $userProposalsICPStore === undefined}
				<SkeletonRows rows={USER_PAGINATION} columns={6} />
			{:else if $userProposalsICPStore === null}
				<tr>
					<td colspan="5">
						<span class="inline-block">Sign-in to submit your own proposals.</span>
					</td>
				</tr>
			{:else if $userProposalsICPStore.items_length === 0n}
				<tr>
					<td colspan="5">
						<span class="inline-block"
							>Your basket of ideas is empty. Start crafting your first proposal now!</span
						>
					</td>
				</tr>
			{:else}
				{#each $userProposalsICPStore.items as doc (doc.key)}
					<UserProposalRow {doc} />
				{/each}
			{/if}
		</tbody>
	</TableContainer>

	<div id="your-proposals-actions">
		{#if $userProposalsICPStore === null}
			<div in:fade class="lg:mx-4 my-4">
				<Button on:click={signIn} color="quaternary">
					<IconICMonochrome /> Continue with Internet Identity
				</Button>
			</div>
		{:else if $userProposalsICPStore?.items_length === 0n}
			<div in:fade class="lg:mx-4 my-4">
				<SubmitLink />
			</div>
		{:else}
			<UserProposalPaginator />
		{/if}
	</div>
</Section>
