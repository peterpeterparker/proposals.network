<script lang="ts">
	import Section from '$lib/components/ui/Section.svelte';
	import UserProposals from '$lib/components/proposals/UserProposals.svelte';
</script>

<Section>
	<h2 class="text-6xl md:text-7xl md:leading-tight mb-12 tracking-tight font-bold lg:mx-4">
		Your proposals
	</h2>

	<UserProposals />
</Section>
