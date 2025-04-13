<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { createEventDispatcher } from 'svelte';
	import { isBusy } from '$lib/derived/busy.derived';
	import Backdrop from '$lib/components/ui/Backdrop.svelte';

	export let wide = false;

	let visible = true;

	const dispatch = createEventDispatcher();

	const close = () => {
		if ($isBusy) {
			return;
		}

		visible = false;
		dispatch('pnwrkClose');
	};
</script>

{#if visible}
	<div
		class="modal flex items-center justify-center"
		transition:fade
		role="dialog"
		aria-labelledby="modalTitle"
		aria-describedby="modalContent"
		on:introend
	>
		<Backdrop on:pnwrkClose={close} />

		<div
			transition:scale={{ delay: 25, duration: 150, easing: quintOut }}
			class="relative max-w-[90vw] md:max-w-(--breakpoint-md) max-h-[86vh] overflow-y-auto px-8 py-4 bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)]"
			class:w-96={!wide}
			class:w-full={wide}
			class:sm:min-w-96={wide}
		>
			<slot />
		</div>
	</div>
{/if}

<style lang="scss">
	@use '../../styles/mixins/display';
	@use '../../styles/mixins/media';

	.modal {
		position: fixed;
		@include display.inset;

		z-index: calc(var(--z-index) + 998);
	}
</style>
