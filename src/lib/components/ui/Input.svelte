<script lang="ts">
	import { fade } from 'svelte/transition';

	export let placeholder: string;
	export let value = '';
	export let disabled = false;
	export let pinPlaceholder = false;

	let dirty = false;
</script>

<div class="bg-white border-2 border-black lg:rounded-md overflow-hidden mb-8">
	<aside class="border-b-2 border-black bg-violet-200 p-2">
		<span>&ZeroWidthSpace;</span>
		{#if (dirty && value !== "") || pinPlaceholder}
			<span in:fade>
				{placeholder}
			</span>
		{/if}
	</aside>

	<input bind:value {placeholder} {disabled} on:focus
		   class:opacity-20={disabled} class="p-2.5 focus:outline-none w-full placeholder-black" on:input={() => (dirty = true)} />
</div>
