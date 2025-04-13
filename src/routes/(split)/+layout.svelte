<script lang="ts">
	import Header from '$lib/components/core/Header.svelte';
</script>

<Header />

<main class="snap-mandatory snap-y overflow-auto">
	<slot />
</main>
