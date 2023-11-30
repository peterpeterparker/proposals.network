<script lang="ts">
	import IconChevronRight from '$lib/components/icons/IconChevronRight.svelte';
</script>

<section
	class="bg-pink-200 w-full h-[calc(100vh-80px)] 2xl:h-[800px] snap-start snap-always shrink-0 border-b-2 border-black relative"
>
	<div class="w-full h-full bg-pink-200 relative flex items-center justify-center flex-col">
		<h1 class="text-center px-2 md:max-w-[70vw] xl:max-w-[50vw]">
			Browse and submit proposals on ICP.
		</h1>

		<div class="flex gap-1 mt-8">
			<input
				class="w-96 border-black border-2 p-2.5 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all"
				placeholder="Proposal ID"
			/>
			<button
				class="h-12 border-black border-2 p-2.5 bg-[#A6FAFF] hover:bg-[#79F7FF] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-[#00E1EF]"
				aria-label="Open the detail of the proposal specified by its ID"
			>
				<IconChevronRight />
			</button>
		</div>
	</div>
</section>
