<script>
	import IconSync from '$lib/components/icons/IconSync.svelte';
	import { fade } from 'svelte/transition';
	import { isWizardBusy } from '$lib/derived/busy.derived';
</script>

<div class="inline-block ml-auto">
	{#if $isWizardBusy}
		<div transition:fade>
			<span class="visually-hidden">Saving...</span>
			<IconSync />
		</div>
	{/if}
</div>
