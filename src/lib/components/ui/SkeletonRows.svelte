<script lang="ts">
	import SkeletonText from '$lib/components/ui/SkeletonText.svelte';
	import type { ComponentType } from 'svelte';
	import { nonNullish } from '@dfinity/utils';

	export let rows: number;
	export let columns: number;
	export let action: ComponentType | undefined = undefined;

	let r: number[];
	$: r = Array.from({ length: rows }, (_, i) => i);

	let c: number[];
	$: c = Array.from({ length: columns - 1 }, (_, i) => i);
</script>

{#each r as _row}
	<tr>
		{#each c as _column}
			<td><SkeletonText /></td>
		{/each}

		{#if nonNullish(action)}
			<td><svelte:component this={action} /></td>
		{/if}
	</tr>
{/each}
