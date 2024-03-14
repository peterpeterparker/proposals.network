<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { isNullish } from '@dfinity/utils';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import { getContext } from 'svelte';

	const { store }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);
</script>

<Button color="tertiary" disabled={isNullish($store?.metadata?.proposalAction)} on:click
	>Continue</Button
>
