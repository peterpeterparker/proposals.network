<script lang="ts">
	import { userStore } from '$lib/stores/user.store';
	import Copy from '$lib/components/ui/Copy.svelte';
	import Button from '$lib/components/ui/Button.svelte';
</script>

<p class="leading-relaxed mb-4">
	Copy your principal <Copy value={$userStore?.key ?? ''} text="Principal copied." /> and add it as a
	hotkey to your neuron. This will grant control of the neuron to the user identified by the principal
	on proposals.network.
</p>

<Button color="secondary" on:click>Done</Button>
