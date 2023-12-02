<script lang="ts">
	import ButtonCell from '$lib/components/ui/ButtonCell.svelte';

	export let key: string;

	let href: string;
	$: href = `/submit/?key=${key}`;
</script>

<td>
	<a class="inline-flex max-w-full gap-1 align-text-top" {href}>
		<ButtonCell>View</ButtonCell>
	</a>
</td>
