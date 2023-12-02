<script lang="ts">
	import IconLink from '$lib/components/icons/IconLink.svelte';

	export let key: string;

	let href: string;
	$: href = `/submit/?key=${key}`;
</script>

<td>
	<a class="inline-flex max-w-full gap-1 align-text-top" {href}>
		<IconLink />
		<span>{key}</span>
	</a>
</td>

<style lang="scss">
	td {
		max-width: 160px;
	}
</style>
