<script lang="ts">
	import SplitPane from '$lib/components/ui/SplitPane.svelte';
	import ProposalResults from '$lib/components/proposal/ProposalResults.svelte';
	import ProposalLoader from '$lib/components/proposal/ProposalLoader.svelte';
	import ProposalInfo from '$lib/components/proposal/ProposalInfo.svelte';
	import ProposalHeader from '$lib/components/proposal/ProposalHeader.svelte';
	import ProposalLinks from '$lib/components/proposal/ProposalLinks.svelte';
	import ProposalTimestamps from '$lib/components/proposal/ProposalTimestamps.svelte';
	import ProposalSummary from '$lib/components/proposal/ProposalSummary.svelte';
	import ProposalAside from '$lib/components/proposal/ProposalNavigation.svelte';
	import ProposalAction from '$lib/components/proposal/ProposalAction.svelte';
</script>

<SplitPane col="reverse">
	<ProposalAside slot="aside" />

	<ProposalLoader>
		<ProposalHeader />

		<div class="md:grid lg:block xl:grid grid-cols-[1fr,auto] items-center gap-16">
			<ProposalInfo />

			<ProposalResults />

			<ProposalLinks />

			<ProposalTimestamps />

			<ProposalSummary />

			<ProposalAction />
		</div>
	</ProposalLoader>
</SplitPane>
