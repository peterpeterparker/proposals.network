<script lang="ts">
	import InputPlaceholder from '$lib/components/ui/InputPlaceholder.svelte';
	import { isNullish } from '@dfinity/utils';
	import { fade } from 'svelte/transition';
	import AttachmentLink from '$lib/components/ui/AttachmentLink.svelte';

	export let placeholder: string;
	export let file: File | undefined;
	export let disabled = false;
	export let downloadUrl: string | undefined = undefined;
	export let accept: string | undefined;

	const onChange = (event: Event) => {
		const target = event.target as unknown as { files: File[] };
		file = target?.files[0];
	};
</script>

<InputPlaceholder {placeholder} pinPlaceholder>
	<input
		type="file"
		on:change={onChange}
		{placeholder}
		{disabled}
		class:opacity-20={disabled}
		class="p-2.5 focus:outline-none w-full placeholder-black"
		{accept}
	/>

	<p class="px-2.5 pt-1 pb-2.5 text-xs">
		{#if isNullish(downloadUrl)}
			&ZeroWidthSpace;
		{:else}
			<span in:fade class="block">
				<AttachmentLink href={downloadUrl}>File attached.</AttachmentLink>
			</span>
		{/if}
	</p>
</InputPlaceholder>
