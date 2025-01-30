<script lang="ts">
	import Header from '$lib/components/core/Header.svelte';
	import '$lib/styles/global.scss';
	import Footer from '$lib/components/core/Footer.svelte';
</script>

<Header submit />

<main class="snap-mandatory snap-y overflow-auto">
	<slot />
</main>

<Footer />
