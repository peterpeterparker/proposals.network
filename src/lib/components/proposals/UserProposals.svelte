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
	import Button from "$lib/components/ui/Button.svelte";
	import {signIn} from "$lib/services/auth.services";
	import IconICMonochrome from "$lib/components/icons/IconICMonochrome.svelte";
	import SubmitLink from "$lib/components/submit/SubmitLink.svelte";

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

	<TableContainer rows={$userProposalsICPStore?.items.length}>
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
				<SkeletonRows rows={4} columns={7} />
			{:else if $userProposalsICPStore === null}
				<tr>
					<td colspan="6">
						<div>
							<span class="inline-block pb-2">Sign-in to submit your own proposals.</span>
							<Button on:click={signIn}>
								<IconICMonochrome /> Continue with Internet Identity
							</Button>
						</div>
					</td>
				</tr>
			{:else if $userProposalsICPStore.items_length === 0n}
				<tr>
					<td colspan="6">
						<div>
							<span class="inline-block pb-2">Your basket of ideas is empty. Start crafting your first proposal now!</span>
							<SubmitLink />
						</div>
					</td>
				</tr>
			{:else}
				{#each $userProposalsICPStore.items as doc}
					<UserProposalRow {doc} />
				{/each}
			{/if}
		</tbody>
	</TableContainer>
</Section>
