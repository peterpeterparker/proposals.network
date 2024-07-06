<script lang="ts">
	import { fade } from 'svelte/transition';

	export let placeholder: string;
	export let pinPlaceholder = false;
	export let dirty = false;
</script>

<div class="bg-white border-2 border-black lg:rounded-md overflow-hidden mb-8">
	<aside class="border-b-2 border-black bg-violet-200 p-2">
		<span>&ZeroWidthSpace;</span>
		{#if dirty || pinPlaceholder}
			<span in:fade>
				{placeholder}
			</span>
		{/if}
	</aside>

	<slot />
</div>
