<script lang="ts">
	import SplitPane from '$lib/components/ui/SplitPane.svelte';
	import ProposalResults from '$lib/components/proposal/ProposalResults.svelte';
	import { fade } from 'svelte/transition';
	import ProposalLoader from '$lib/components/proposal/ProposalLoader.svelte';
</script>

<SplitPane>
	<svelte:fragment slot="aside">Stuffs Prev - Next</svelte:fragment>

	<ProposalLoader>
		<div class="lg:grid grid-cols-2" in:fade>
			<div>Summary</div>

			<div class="flex flex-col items-center">
				<ProposalResults />
			</div>
		</div>
	</ProposalLoader>
</SplitPane>
