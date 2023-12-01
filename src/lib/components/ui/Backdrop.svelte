<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { handleKeyPress } from '$lib/utils/keyboard.utils';

	const dispatch = createEventDispatcher();
	const close = () => dispatch('pnClose');
</script>

<div
	role="button"
	on:click|stopPropagation={close}
	on:keypress={($event) => handleKeyPress({ $event, callback: close })}
	on:click
	class="fixed inset-0 bg-gray-800 opacity-80"
	tabindex="-1"
></div>
