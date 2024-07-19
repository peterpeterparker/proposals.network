<script lang="ts">
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import { createEventDispatcher } from 'svelte';

	export let neuronId: string | bigint;

	const dispatch = createEventDispatcher();
	const doDelete = () => dispatch('pnwrkDelete');
	const close = () => dispatch('pnwrkClose');
</script>

<Dialog on:pnwrkClose>
	<h2 class="mb-6 text-2xl">Are you certain you want to delete neuron {neuronId}?</h2>
	<div class="flex gap-2 space-x-2 mx-auto w-32">
		<button class="text-base" on:click={close}>Cancel</button>
		<button
			class="h-12 border-black border-2 p-2.5 bg-[#A6FAFF] hover:bg-[#79F7FF] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-[#00E1EF] rounded-full"
			on:click={doDelete}
		>
			Delete
		</button>
	</div>
</Dialog>
