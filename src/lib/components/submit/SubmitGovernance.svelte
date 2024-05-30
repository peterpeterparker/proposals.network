<script lang="ts">
	import { governanceStore } from '$lib/derived/governance.derived';
	import { nonNullish } from '@dfinity/utils';
	import { fade } from 'svelte/transition';
	import Img from '$lib/components/ui/Img.svelte';
</script>

{#if nonNullish($governanceStore)}
	<p
		class="px-3 py-1 mt-3 mb-12 bg-black text-white border-2 border-black lg:rounded-md w-fit text-sm"
	>
		<span class="inline-flex gap-2 align-middle" in:fade
			><span><Img src={$governanceStore?.logo} width="20px" height="20px" /></span>
			<span class="truncate">{$governanceStore.name}</span></span
		>
	</p>
{/if}
