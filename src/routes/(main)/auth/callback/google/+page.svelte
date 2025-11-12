<script lang="ts">
	import { onMount } from 'svelte';
	import { handleRedirectCallback } from '@junobuild/core';
	import { goto } from '$app/navigation';

	const register = async () => {
		await handleRedirectCallback();

		await goto('/', { replaceState: true });
	};

	onMount(register);
</script>

<section
	class="relative bg-pink-200 w-full h-[calc(100vh-80px)] 2xl:h-[800px] snap-start snap-always shrink-0 border-b-2 border-black overflow-hidden"
>
	<div class="w-full h-full relative flex items-center justify-center flex-col pt-24">
		<p class="animate-bounce">Hold tight...</p>
	</div>
</section>
