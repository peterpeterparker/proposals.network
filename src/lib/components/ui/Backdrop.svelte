<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { handleKeyPress } from '$lib/utils/keyboard.utils';

	export let transparent = false;

	const dispatch = createEventDispatcher();
	const close = () => dispatch('pnwrkClose');
</script>

<div
	role="button"
	on:click|stopPropagation={close}
	on:keypress={($event) => handleKeyPress({ $event, callback: close })}
	on:click
	class={`fixed inset-0 ${transparent ? '' : 'bg-gray-800 opacity-80 backdrop-blur-xs'}`}
	tabindex="-1"
></div>
