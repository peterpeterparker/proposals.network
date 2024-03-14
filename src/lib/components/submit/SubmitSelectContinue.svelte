<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { isNullish } from '@dfinity/utils';
	import { METADATA_CONTEXT_KEY, type MetadataContext } from '$lib/types/metadata.context';
	import { getContext } from 'svelte';

	const { store }: MetadataContext = getContext<MetadataContext>(METADATA_CONTEXT_KEY);
</script>

<Button color="tertiary" disabled={isNullish($store?.metadata?.proposalAction)} on:click
	>Continue</Button
>
