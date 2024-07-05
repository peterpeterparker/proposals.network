<script lang="ts">
	import HeroAnimation from '$lib/components/core/HeroAnimation.svelte';
	import IconDoubleArrow from '$lib/components/icons/IconDoubleArrow.svelte';

	const scroll = () => {
		const element = document.getElementById('your-proposals-actions');
		element?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
	};
</script>

<section
	class="relative bg-pink-200 w-full h-[calc(100vh-80px)] 2xl:h-[800px] snap-start snap-always shrink-0 border-b-2 border-black overflow-hidden"
>
	<HeroAnimation />

	<div class="w-full h-full relative flex items-center justify-center flex-col pt-24">
		<h1 class="text-center px-2 md:max-w-[70vw] xl:max-w-[50vw] text-5xl sm:text-7xl sm:leading-tight">
			Browse and submit proposals on ICP
		</h1>

		<button class="animate-bounce pt-16" on:click={scroll} aria-label="Continue">
			<IconDoubleArrow />
		</button>
	</div>
</section>
