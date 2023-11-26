<script lang="ts">
	export let table: HTMLDivElement | null;

	export let color: 'primary' | 'secondary' = 'primary';
</script>

<div
	class="overflow-x-scroll overflow-y-hidden lg:overflow-hidden border-2 border-black lg:rounded-md"
>
	<table bind:this={table} class={`${color}`}>
		<slot />
	</table>
</div>
