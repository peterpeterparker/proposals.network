<script lang="ts">
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import { createEventDispatcher } from 'svelte';
	import IconError from '$lib/components/icons/IconError.svelte';

	export let neuronId: string | bigint;

	const dispatch = createEventDispatcher();
	const doDelete = () => dispatch('pnwrkDelete');
	const close = () => dispatch('pnwrkClose');
</script>

<Dialog on:pnwrkClose>
	<h2 class="mb-6 text-2xl">Are you sure you want to delete the reference to neuron {neuronId}?</h2>

	<p class="leading-relaxed text-sm mt-4 mb-8">
		<IconError /> If you delete it, please remember to also remove the associated hotkeys in the related
		neuron.
	</p>

	<div class="flex justify-center gap-2 w-full">
		<button
			class="w-24 h-12 border-black border-2 p-2.5 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-[#00E1EF] rounded-full"
			on:click={close}>No</button
		>
		<button
			class="w-24 h-12 border-black border-2 p-2.5 bg-[#A6FAFF] hover:bg-[#79F7FF] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-[#00E1EF] rounded-full"
			on:click={doDelete}
		>
			Yes
		</button>
	</div>
</Dialog>

<style lang="scss">
	@use '../../styles/mixins/text';

	h2 {
		word-break: break-all;
		@include text.clamp(3);
	}
</style>
