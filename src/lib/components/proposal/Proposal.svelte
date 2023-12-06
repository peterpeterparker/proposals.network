<script lang="ts">
	import SplitPane from '$lib/components/ui/SplitPane.svelte';
	import ProposalResults from '$lib/components/proposal/ProposalResults.svelte';
	import ProposalLoader from '$lib/components/proposal/ProposalLoader.svelte';
	import ProposalInfo from '$lib/components/proposal/ProposalInfo.svelte';
</script>

<SplitPane>
	<svelte:fragment slot="aside">Stuffs Prev - Next</svelte:fragment>

	<ProposalLoader>
		<div class="md:grid lg:block xl:grid grid-cols-[1fr,auto] items-center gap-16">
			<ProposalInfo />

			<div class="flex flex-col items-center">
				<ProposalResults />
			</div>
		</div>
	</ProposalLoader>
</SplitPane>
