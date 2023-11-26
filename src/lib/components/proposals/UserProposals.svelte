<script>
	import SkeletonRows from '$lib/components/ui/SkeletonRows.svelte';
	import TableContainer from '$lib/components/ui/TableContainer.svelte';
</script>

<section
	class="bg-lime-100 w-full md:h-screen lg:h-full snap-start snap-always shrink-0 border-b-2 border-black py-24 px-4"
>
	<h2 class="text-6xl md:text-7xl mb-12 tracking-tight font-bold mx-4">Your proposals.</h2>

	<TableContainer rows={10} color="secondary">
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
</section>
