<script lang="ts">
	import { userProposalsICPStore } from '$lib/derived/user-proposals.derived';
	import { nonNullish } from '@dfinity/utils';
	import IconNavigateNext from '$lib/components/icons/IconNavigateNext.svelte';
	import ButtonIcon from '$lib/components/ui/ButtonIcon.svelte';
	import { loadUserProposals } from '$lib/services/loader-stores.services';
	import { last } from '$lib/utils/utils';

	let previousStartAfter: string | undefined;
	let startAfter: string | undefined;

	const search = async () => await loadUserProposals({ startAfter });

	const prev = async () => {
		startAfter = previousStartAfter;
		previousStartAfter = undefined;

		await search();
	};

	const next = async () => {
		previousStartAfter = startAfter;
		startAfter = last($userProposalsICPStore?.items ?? [])?.key;

		await search();
	};

	let displayPrev: boolean;
	$: displayPrev = ($userProposalsICPStore?.items_page ?? 0n) > 0n;

	let displayNext: boolean;
	$: displayNext =
		nonNullish($userProposalsICPStore) &&
		($userProposalsICPStore.matches_pages ?? 0n) > ($userProposalsICPStore.items_page ?? 0n) + 1n;
</script>

{#if nonNullish($userProposalsICPStore)}
	<nav class="w-full flex justify-center p-4">
		<ButtonIcon disabled={!displayPrev} on:click={prev} ariaLabel="Previous page of data"
			><IconNavigateNext navigate="previous" /></ButtonIcon
		>
		<ButtonIcon disabled={!displayNext} on:click={next} ariaLabel="Next page of data"
			><IconNavigateNext /></ButtonIcon
		>
	</nav>
{/if}
