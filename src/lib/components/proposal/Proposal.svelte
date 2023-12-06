<script lang="ts">
	import SplitPane from '$lib/components/ui/SplitPane.svelte';
	import ProposalResults from "$lib/components/proposal/ProposalResults.svelte";
</script>

<SplitPane>
	<svelte:fragment slot="aside">
		Stuffs Prev - Next
	</svelte:fragment>

	<div class="lg:grid grid-cols-2">
		<div>
			Summary
		</div>

		<div class="flex justify-center">
			<ProposalResults />
		</div>
	</div>
</SplitPane>
