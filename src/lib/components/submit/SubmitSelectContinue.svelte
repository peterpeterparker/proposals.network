<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import type { ProposalAction } from '$lib/types/governance';
	import { isNullish } from '@dfinity/utils';


	export let proposalAction: ProposalAction | undefined;
</script>

<Button color="tertiary" disabled={isNullish(proposalAction)} on:click>Continue</Button>
