<script lang="ts">
	import UserProposalsLoader from '$lib/components/proposals/UserProposalsLoader.svelte';
	import GovernanceSubmitLink from '$lib/components/governance/GovernanceSubmitLink.svelte';

	interface Props {
		cta?: boolean;
	}

	let { cta = true }: Props = $props();
</script>

<UserProposalsLoader>
	<div class="flex-col px-4 md:px-0 hidden lg:flex">
		{#if cta}
			<span class="text-lg font-bold block mb-4">You miss a 100% of the shots you don't take.</span>

			<GovernanceSubmitLink color="quaternary" />
		{/if}
	</div>
</UserProposalsLoader>
