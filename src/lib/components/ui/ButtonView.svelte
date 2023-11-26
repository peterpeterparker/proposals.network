<script lang="ts">
	import IconView from '$lib/components/icons/IconView.svelte';

	export let disabled = false;
</script>

<div class="py-0 px-5 flex items-center justify-center flex-col">
	<button
		class="border-black border-2 bg-cyan-200 hover:bg-cyan-300 active:bg-cyan-400 transition-all rounded-none h-10 px-5 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
		class:opacity-20={disabled}
		on:click
		{disabled}><IconView /></button
	>
</div>

<style lang="scss">
	div {
		min-height: var(--tr-height);
	}
</style>
