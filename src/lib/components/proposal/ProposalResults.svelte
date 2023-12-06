<script lang="ts">
	import IconVotingResults from '$lib/components/icons/IconVotingResults.svelte';
</script>

<div class="flex items-center justify-center my-8 relative h-[360px] w-[360px]">
	<div
		class="absolute rounded-full top-1/2 left-1/2 mt-2 transform -translate-x-1/2 -translate-y-1/2 h-[180px] w-[180px] overflow-hidden -rotate-[199.5deg]"
	>
		<div class="bg-lime-400 w-full h-[50%] z-20 border-b-4 border-black"></div>
		<div class="bg-red-300 w-full h-[100%] z-10"></div>
	</div>

	<div class="block z-10">
		<IconVotingResults />
	</div>
</div>
