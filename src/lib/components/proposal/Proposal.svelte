<script lang="ts">
	import SplitPane from '$lib/components/ui/SplitPane.svelte';
	import ProposalResults from '$lib/components/proposal/ProposalResults.svelte';
	import ProposalLoader from '$lib/components/proposal/ProposalLoader.svelte';
	import ProposalInfo from '$lib/components/proposal/ProposalInfo.svelte';
	import ProposalHeader from '$lib/components/proposal/ProposalHeader.svelte';
	import ProposalExternalLinks from '$lib/components/proposal/ProposalExternalLinks.svelte';
	import ProposalTimestamps from '$lib/components/proposal/ProposalTimestamps.svelte';
	import ProposalSummary from '$lib/components/proposal/ProposalSummary.svelte';
</script>

<SplitPane>
	<svelte:fragment slot="aside">Stuffs Prev - Next - Share - Vote link</svelte:fragment>

	<ProposalLoader>
		<ProposalHeader />

		<div class="md:grid lg:block xl:grid grid-cols-[1fr,auto] items-center gap-16">
			<ProposalInfo />

			<ProposalResults />

			<ProposalExternalLinks />

			<ProposalTimestamps />

			<ProposalSummary />
		</div>
	</ProposalLoader>
</SplitPane>
