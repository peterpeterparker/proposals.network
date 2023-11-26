<script lang="ts">
	import { slide, blur } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Backdrop from '$lib/components/ui/Backdrop.svelte';
	import IconClose from '$lib/components/icons/IconClose.svelte';
	import IconGitHub from '$lib/components/icons/IconGitHub.svelte';

	export let visible = false;
</script>

{#if visible}
	<div class="navbar-menu relative z-50 block">
		<Backdrop on:pnClose={() => (visible = false)} />
		<nav
			in:blur={{ amount: 10, duration: 250 }}
			out:slide={{ easing: quintOut, axis: 'x', duration: 150 }}
			class="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm bg-white border-r overflow-y-auto border-r-2 border-black"
		>
			<div class="flex justify-center items-center h-20 p-5">
				<a class="mr-auto text-2xl font-bold leading-none" href="/">LOGO.</a>
				<div>
					<button on:click={() => (visible = false)}><IconClose /></button>
				</div>
			</div>
			<div class="p-5">
				<ul class="flex flex-col">
					<div class="pb-8">
						<span class="text-lg font-bold block mb-4">Getting started</span>
						<div class="hover:underline hover:underline-offset-8 mb-4">
							<a href="/overview">Overview</a>
						</div>
					</div>
					<div class="pb-12">
						<span class="text-lg font-bold block mb-4">Components</span>
						<div class="hover:underline hover:underline-offset-8 mb-4">
							<a href="/components/card">Card</a>
						</div>
						<div class="hover:underline hover:underline-offset-8 mb-4">
							<a href="/components/button">Button</a>
						</div>
						<div class="hover:underline hover:underline-offset-8 mb-4">
							<a href="/components/iconButton">IconButton</a>
						</div>
						<div class="hover:underline hover:underline-offset-8 mb-4">
							<a href="/components/input">Input</a>
						</div>
						<div class="hover:underline hover:underline-offset-8 mb-4">
							<a href="/components/dialog">Dialog</a>
						</div>
						<div class="hover:underline hover:underline-offset-8 mb-4">
							<a href="/components/checkbox">Checkbox</a>
						</div>
						<div class="hover:underline hover:underline-offset-8 mb-4">
							<a href="/components/dropdown">DropDown</a>
						</div>
					</div>
					<div class="pb-4">
						<div class="cursor-pointer">
							<a
								href="https://github.com/peterpeterparker/proposals.network"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Go to proposals-network source code on GitHub"><IconGitHub /></a
							>
						</div>
					</div>
				</ul>
			</div>
		</nav>
	</div>
{/if}
