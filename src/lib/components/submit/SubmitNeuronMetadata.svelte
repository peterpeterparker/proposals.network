<script lang="ts">
	import { userStore } from '$lib/stores/user.store';
	import Button from '$lib/components/ui/Button.svelte';
	import Copy from '$lib/components/ui/Copy.svelte';
	import {createEventDispatcher} from "svelte";

	export let neuronId: bigint | undefined;

	const dispatch = createEventDispatcher();
	const next = () => dispatch('pnwrkNext');
</script>

<p class="leading-relaxed mb-4">
	You've already added a hotkey for your principal <Copy
		value={$userStore?.key ?? ''}
		text="Principal copied."
	/> and your neuron ID <Copy value={`${neuronId}`} text="Neuron ID copied." />. You can skip this
	step and proceed to the review.
</p>

<Button color="secondary" on:click={next}>Review</Button>

<p class="leading-relaxed text-sm mt-8 mb-4 italic">
    Please note that editing this data is currently not supported but, I welcome contributions via pull requests on the <a
        href="https://github.com/peterpeterparker/proposals.network"
        target="_blank"
        class="underline underline-offset-2"
        rel="noopener noreferrer nofollow">GitHub repository</a
>.
</p>
