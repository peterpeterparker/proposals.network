<script lang="ts">
	import IconSync from '$lib/components/icons/IconSync.svelte';
	import { fade } from 'svelte/transition';
	import { isWizardBusy } from '$lib/derived/busy.derived';
</script>

<div class="fixed bottom-4 right-4 lg:right-auto lg:left-24">
	{#if $isWizardBusy}
		<div transition:fade class="flex text-xs gap-0.5 items-center animate-bounce">
			<span>Saving...</span>
			<IconSync />
		</div>
	{/if}
</div>
