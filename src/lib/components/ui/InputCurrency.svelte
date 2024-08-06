<script lang="ts">
	import InputPlaceholder from '$lib/components/ui/InputPlaceholder.svelte';
	import { nonNullish } from '@dfinity/utils';
	import Input from '$lib/components/ui/Input.svelte';

	export let placeholder: string;
	export let value: string | number | undefined;
	export let disabled = false;
	export let pinPlaceholder = false;
	export let decimals: number | undefined = undefined;

	let dirty = false;
</script>

<InputPlaceholder {placeholder} {pinPlaceholder} dirty={dirty && nonNullish(value)}>
	<div class:opacity-20={disabled} class="p-2.5 focus:outline-none w-full placeholder-black">
		<Input
			name="currency"
			inputType="currency"
			required
			bind:value
			{placeholder}
			{disabled}
			{decimals}
			on:focus
			on:input={() => (dirty = true)}
			spellcheck={false}
		/>
	</div>
</InputPlaceholder>
