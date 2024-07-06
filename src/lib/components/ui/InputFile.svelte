<script lang="ts">
	import InputPlaceholder from '$lib/components/ui/InputPlaceholder.svelte';

	export let placeholder: string;
	export let file: File | undefined;
	export let disabled = false;

	const onChange = (event: Event) => {
		const target = event.target as unknown as { files: File[] };
		file = target?.files[0];
	};
</script>

<InputPlaceholder {placeholder} pinPlaceholder>
	<input
		type="file"
		on:change={onChange}
		{placeholder}
		{disabled}
		class:opacity-20={disabled}
		class="p-2.5 focus:outline-none w-full placeholder-black"
		accept=".yml,.yaml"
	/>
</InputPlaceholder>
