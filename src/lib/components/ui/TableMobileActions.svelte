<script lang="ts">
	import { nonNullish } from '@dfinity/utils';
	import ButtonView from '$lib/components/ui/ButtonView.svelte';
	import { fade } from 'svelte/transition';
	import type { Component } from 'svelte';
	import IconView from '$lib/components/icons/IconView.svelte';

	export let table: HTMLTableElement | null;
	export let rows: number | undefined;
	export let actionLabel: string | undefined;
	export let actionIcon: Component | undefined;

	let rowAriaLabel: string;
	$: rowAriaLabel = actionLabel ?? 'View';
	let rowActionIcon: Component;
	$: rowActionIcon = actionIcon ?? IconView;

	let r: number[];
	$: r = Array.from({ length: rows ?? 0 }, (_, i) => i);

	const trigger = (row: number) =>
		(
			table?.querySelector(
				`tr:nth-of-type(${row + 1}) button:first-of-type`
			) as HTMLButtonElement | null
		)?.click();
</script>

{#if nonNullish(rows) && rows > 0}
	<div
		class="absolute right-0 top-0 bottom-0 flex flex-col lg:hidden"
		transition:fade={{ duration: 150 }}
	>
		{#each r as row}
			<ButtonView on:click={() => trigger(row)} ariaLabel={rowAriaLabel} icon={rowActionIcon} />
		{/each}
	</div>
{/if}

<style lang="scss">
	div {
		padding: calc(var(--tr-height) + 2px) 0 0;
	}
</style>
