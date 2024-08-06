<script lang="ts">
	import { userStore } from '$lib/stores/user.store';
	import Copy from '$lib/components/ui/Copy.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import ExternalLink from '$lib/components/ui/ExternalLink.svelte';
</script>

<p class="leading-relaxed mb-2">
	Grant control to the user identified by the principal on proposals.network by copying your
	principal <Copy value={$userStore?.key ?? ''} text="Principal copied." /> and adding it as a hotkey
	to your neuron in <ExternalLink href="https://nns.internetcomputer.org/neurons"
		>NNS dapp</ExternalLink
	>.
</p>

<p class="leading-relaxed text-sm mt-8 mb-12 italic">
	* You can find the "Hotkey" action in the detail page of your neuron.
</p>

<Button color="secondary" on:click>Done</Button>
