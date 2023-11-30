<script lang="ts">
	import IconDone from "$lib/components/icons/IconDone.svelte";
	import { fade } from 'svelte/transition';

	export let status: 'pending' | 'active' | 'done' = 'pending';

	let active: boolean;
	$: active = status === 'active';
</script>

<li class="inline-flex gap-2 items-center mb-4">
	<div
		class="w-8 h-8 inline-flex items-center justify-center border-2 rounded-full border-black"
		class:bg-white={active}
		class:shadow-[2px_2px_0px_rgba(0,0,0,1)]={active}
	>
		{#if status === 'done'}
			<span class="inline-block" in:fade>
				<IconDone />
			</span>
		{:else}
			<slot name="step" />
		{/if}
	</div>

	<span class="hidden sm:inline-block"><slot /></span>
</li>
