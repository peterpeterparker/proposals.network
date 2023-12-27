<script lang="ts">
	import { fade } from 'svelte/transition';
	import Img from '$lib/components/ui/Img.svelte';
	import type { Governance } from '$lib/types/governance';
	import { nonNullish } from '@dfinity/utils';

	export let governance: Governance | undefined;
</script>

<td>
	{#if nonNullish(governance)}
		<span class="inline-flex gap-1" in:fade
			><Img src={governance?.logo} width="24px" />
			<span class=" truncate">{governance.name}</span></span
		>
	{/if}
</td>
