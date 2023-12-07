<script lang="ts">
	import ButtonIcon from '$lib/components/ui/ButtonIcon.svelte';
	import IconNavigateNext from '$lib/components/icons/IconNavigateNext.svelte';
	import { createEventDispatcher } from 'svelte';

	export let displayPrev = false;
	export let displayNext = false;

	const dispatch = createEventDispatcher();
	const prev = () => dispatch('pnwrkPrevious');
	const next = () => dispatch('pnwrkNext');
</script>

<nav class="w-full flex justify-center p-4">
	<ButtonIcon disabled={!displayPrev} on:click={prev} ariaLabel="Previous"
		><IconNavigateNext navigate="previous" /></ButtonIcon
	>
	<ButtonIcon disabled={!displayNext} on:click={next} ariaLabel="Next"
		><IconNavigateNext /></ButtonIcon
	>
</nav>
