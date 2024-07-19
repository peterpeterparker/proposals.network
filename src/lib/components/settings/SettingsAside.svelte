<script lang="ts">
	import UserProposalsLoader from '$lib/components/proposals/UserProposalsLoader.svelte';
	import { userProposalsStore } from '$lib/stores/user-proposals.store';

	let countSubmitted: number;
	$: countSubmitted = ($userProposalsStore?.items ?? []).filter(
		({ data: { status } }) => status === 'submitted'
	).length;
</script>

<UserProposalsLoader>
	<div class="flex-col px-4 md:px-0 hidden lg:flex">
		<span class="text-lg font-bold block mb-4">You miss a 100% of the shots you don't take.</span>

		<p class="leading-relaxed mb-4">
			You created <strong>{$userProposalsStore?.items.length ?? 0}</strong> proposals and submitted
			<strong>{countSubmitted}</strong>
			of them.
		</p>
	</div>
</UserProposalsLoader>
