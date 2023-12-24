<script lang="ts">
	import { routeProposalId } from '$lib/derived/nav.derived';
	import { nonNullish } from '@dfinity/utils';
	import { layoutTitleStore } from '$lib/stores/layout.store';
	import { onDestroy } from 'svelte';

	let pageTitle = 'Proposals.network';
	$: pageTitle = `${nonNullish($routeProposalId) && $routeProposalId !== '' ? `Proposal ` : ''}${
		$routeProposalId ?? ''
	}${nonNullish($routeProposalId) && $routeProposalId !== '' ? ` / ` : ''}Proposals.network`;

	$: layoutTitleStore.set(pageTitle);

	onDestroy(() => layoutTitleStore.set('Proposals.network'));
</script>

<slot />
