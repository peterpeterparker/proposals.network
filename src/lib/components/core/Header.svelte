<script lang="ts">
	import IconMenu from '$lib/components/icons/IconMenu.svelte';
	import Menu from '$lib/components/core/Menu.svelte';
	import IconLogo from '$lib/components/icons/IconLogo.svelte';
	import GovernanceSubmitLink from '$lib/components/governance/GovernanceSubmitLink.svelte';
	import { governanceIdStore } from '$lib/derived/governance.derived';
	import { homeUrl } from '$lib/utils/nav.utils';

	export let submit = false;

	let visible = false;

	let url: string;
	$: url = homeUrl({ governanceId: $governanceIdStore });
</script>

<header class="bg-white h-20 w-full fixed top-0 z-10 border-b-2 border-black z-40">
	<div class="w-full h-full m-auto flex justify-between items-center px-5 md:px-24">
		<a class="text-2xl font-bold" href={url} aria-label="Proposals.network home"><IconLogo /></a>
		<nav class="w-1/2 h-full">
			<ul class="flex justify-end items-center space-x-4 h-full">
				{#if submit}
					<li class="hidden md:block pr-3">
						<GovernanceSubmitLink />
					</li>
				{/if}
				<li class="h-full flex border-l-2 border-black pl-5">
					<button on:click={() => (visible = !visible)}><IconMenu /></button>
				</li>
			</ul>
		</nav>
	</div>

	<Menu bind:visible />
</header>
