<script>
	import IconMenu from '$lib/components/icons/IconMenu.svelte';
	import Menu from '$lib/components/core/Menu.svelte';

	let visible = false;
</script>

<header class="bg-white h-20 w-full fixed top-0 z-40 border-b-2 border-black">
	<div class="w-full h-full m-auto flex justify-between items-center px-5 md:px-24">
		<a class="text-2xl font-bold" href="/">proposals.network.</a>
		<nav class="w-1/2 h-full">
			<ul class="flex justify-end items-center space-x-4 h-full">
				<li class="hidden md:block pr-3">
					<a href="/submit"
						><button
							class="border-black border-2 bg-cyan-200 hover:bg-cyan-300 active:bg-cyan-400 transition-all rounded-none h-12 px-5 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
							>Submit a proposal</button
						></a
					>
				</li>
				<li class="h-full flex border-l-2 border-black pl-5">
					<button on:click={() => (visible = !visible)}><IconMenu /></button>
				</li>
			</ul>
		</nav>
	</div>

	<Menu bind:visible />
</header>
