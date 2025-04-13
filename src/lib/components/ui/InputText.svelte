<script lang="ts">
	import InputPlaceholder from '$lib/components/ui/InputPlaceholder.svelte';

	export let placeholder: string;
	export let value = '';
	export let disabled = false;
	export let pinPlaceholder = false;

	let dirty = false;
</script>

<InputPlaceholder {placeholder} {pinPlaceholder} dirty={dirty && value !== ''}>
	<input
		bind:value
		{placeholder}
		{disabled}
		on:focus
		class:opacity-20={disabled}
		class="p-2.5 focus:outline-hidden w-full placeholder-black"
		on:input={() => (dirty = true)}
	/>
</InputPlaceholder>
