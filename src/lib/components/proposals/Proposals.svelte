<script lang="ts">
	import TableContainer from '$lib/components/ui/TableContainer.svelte';
	import SkeletonRows from '$lib/components/ui/SkeletonRows.svelte';
	import Section from "$lib/components/ui/Section.svelte";
</script>

<Section styleClass="bg-yellow-200">
	<h2 class="text-6xl md:text-7xl mb-12 tracking-tight font-bold mx-4">Network.</h2>

	<TableContainer rows={10}>
		<thead>
			<tr>
				<th>ID</th>
				<th>Title</th>
				<th>Topic</th>
				<th></th>
				<th></th>
				<th></th>
			</tr>
		</thead>

		<tbody>
			<SkeletonRows rows={10} columns={7} />
		</tbody>
	</TableContainer>
</Section>