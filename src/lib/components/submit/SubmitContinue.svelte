<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { isWizardBusy } from '$lib/derived/busy.derived';
</script>

<Button color="tertiary" disabled={$isWizardBusy} on:click>Continue</Button>
