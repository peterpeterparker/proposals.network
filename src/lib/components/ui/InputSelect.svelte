<script lang="ts">
	import { isNullish } from '@dfinity/utils';
	import IconChevronDown from '$lib/components/icons/IconChevronDown.svelte';

	export let value: string | null | undefined = undefined;
	export let disabled = false;

	let logo = true;
	$: logo = $$slots['logo'] == true;
</script>

<div class="relative w-fit md:w-96" class:opacity-20={disabled}>
	<select
		bind:value
		on:change
		class:text-gray-400={isNullish(value)}
		{disabled}
		class="transition-all w-full outline-none border-2 border-black h-12 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-cyan-300 focus:bg-cyan-400"
		class:px-12={logo}
		class:pr-12={!logo}
		class:pl-4={!logo}
	>
		{#if isNullish(value)}
			<slot name="placeholder" />
		{/if}

		<slot />
	</select>

	<div class="absolute top-[50%] -translate-y-1/2 left-0 p-2 pointer-events-none max-w-[48px]">
		<slot name="logo" />
	</div>

	<div class="absolute top-[50%] -translate-y-1/2 right-0 p-5 pointer-events-none">
		<IconChevronDown size="32px" />
	</div>
</div>
