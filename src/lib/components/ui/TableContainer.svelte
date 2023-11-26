<script lang="ts">
	import Table from '$lib/components/ui/Table.svelte';
	import TableMobileActions from '$lib/components/ui/TableMobileActions.svelte';

	export let color: 'primary' | 'secondary' = 'primary';
	export let rows: number | undefined;

	let table: HTMLTableElement | null;
</script>

<div class="relative col-span-full lg:mx-4">
	<Table bind:table {color}>
		<slot />
	</Table>

	<TableMobileActions {table} {rows} />
</div>
