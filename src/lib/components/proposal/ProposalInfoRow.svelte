<script lang="ts">
	import { nonNullish } from '@dfinity/utils';
	import { fade } from 'svelte/transition';

	export let value: string | bigint | number | boolean | undefined;
</script>

<div class="flex justify-between py-3 px-2 gap-1">
	<span><slot />:</span>
	{#if nonNullish(value)}
		<span class="inline-block truncate max-w-full" in:fade>{value}</span>
	{/if}
</div>
