<script lang="ts">
	import Header from '$lib/components/core/Header.svelte';
	import '$lib/styles/global.scss';
</script>

<Header />

<main class="snap-mandatory snap-y overflow-auto">
	<slot />
</main>
