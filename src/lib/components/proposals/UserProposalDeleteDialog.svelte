<script lang="ts">
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import { createEventDispatcher } from 'svelte';
	import type {ProposalMetadataDoc} from "$lib/types/juno";

	export let doc: ProposalMetadataDoc;

	const dispatch = createEventDispatcher();
	const doDelete = () => dispatch('pnwrkDelete');
	const close = () => dispatch('pnwrkClose');
</script>

<Dialog on:pnwrkClose>
	<h2 class="mb-6 text-2xl">Are you sure you want to delete the proposal {doc.key}?</h2>

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
