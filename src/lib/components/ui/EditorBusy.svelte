<script>
	import IconSync from '$lib/components/icons/IconSync.svelte';
	import { wizardBusy } from '$lib/stores/busy.store';
	import { fade } from 'svelte/transition';
</script>

<div class="inline-block ml-auto">
	{#if $wizardBusy}
		<div transition:fade>
			<span class="visually-hidden">Saving...</span>
			<IconSync />
		</div>
	{/if}
</div>
