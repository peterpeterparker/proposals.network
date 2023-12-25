<script lang="ts">
	import InputInline from '$lib/components/ui/InputInline.svelte';
	import IconChevronRight from '$lib/components/icons/IconChevronRight.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { handleKeyPress } from '$lib/utils/keyboard.utils';
	import { isNullish } from '@dfinity/utils';
	import { goto } from '$app/navigation';
	import { proposalUrl } from '$lib/utils/nav.utils';
	import { governanceIdStore } from '$lib/derived/governance.derived';

	let proposalId = '';

	const open = async () => {
		if (isNullish(proposalId) || proposalId === '') {
			return;
		}

		await goto(proposalUrl({ id: proposalId, governanceId: $governanceIdStore }));
	};
</script>

<h2 class="mt-16 mb-6 lg:px-4 text-4xl">Access a proposal</h2>

<p class="leading-relaxed mb-4 lg:px-4">
	Sometimes, it's cool to jump right into a specific proposal.
</p>

<div class="flex gap-1 mt-2 max-w-full lg:px-4 pb-6">
	<InputInline
		bind:value={proposalId}
		placeholder="Open proposal with ID"
		on:keypress={($event) => handleKeyPress({ $event, callback: open })}
	/>
	<Button color="quaternary" on:click={open}><IconChevronRight /></Button>
</div>
