<script lang="ts">
	import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Backdrop from './Backdrop.svelte';

	export let anchor: HTMLElement | undefined = undefined;
	export let visible = false;
	export let direction: 'ltr' | 'rtl' = 'ltr';

	let bottom: number;
	let left: number;
	let right: number;
	const initPosition = () =>
		({ bottom, left, right } = anchor
			? anchor.getBoundingClientRect()
			: { bottom: 0, left: 0, right: 0 });
	$: anchor, visible, initPosition();
</script>

<svelte:window on:resize={initPosition} />

{#if visible}
	<div
		role="menu"
		aria-orientation="vertical"
		class="popover z-50"
		tabindex="-1"
		style="--popover-top: {`${bottom}px`}; --popover-left: {`${left}px`}; --popover-right: {`${
			window.innerWidth - right
		}px`}"
		on:click|stopPropagation
		on:keypress|stopPropagation
	>
		<Backdrop on:pnwrkClose={() => (visible = false)} />

		<div
			class="wrapper"
			transition:scale|global={{ delay: 25, duration: 150, easing: quintOut }}
			class:rtl={direction === 'rtl'}
		>
			<div
				class="box relative max-w max-w-sm px-6 py-4 bg-white border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] top-6 before:w-4 before:h-4 before:rotate-45 before:bg-black before:absolute before:-top-1.5 before:left-2 before:mx-auto before:border-2 before:border-black"
			>
				<slot />
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	@use '../../../lib/styles/mixins/display';

	.popover {
		position: fixed;
		@include display.inset;
	}

	.wrapper {
		cursor: initial;

		// position
		position: absolute;
		top: var(--popover-top);
		left: var(--popover-left);

		&.rtl {
			left: auto;
			right: var(--popover-right);
		}
	}

	.box {
		transform-style: preserve-3d;

		&:before {
			transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
				skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
				scaleY(var(--tw-scale-y)) translateZ(-1px);
		}
	}
</style>
