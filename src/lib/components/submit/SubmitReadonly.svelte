<script lang="ts">
	import { onMount } from 'svelte';
	import { getDocMetadata } from '$lib/services/idb.services';
	import type { Doc } from '@junobuild/core';
	import type { ProposalMetadata } from '$lib/types/juno';
    import {isNullish} from "@dfinity/utils";
    import SpinnerText from "$lib/components/ui/SpinnerText.svelte";
    import SubmitError from "$lib/components/submit/SubmitError.svelte";
    import { fade } from 'svelte/transition';
    import SubmitProposalNav from "$lib/components/submit/SubmitProposalNav.svelte";

	let metadata: Doc<ProposalMetadata> | undefined;

    let status: 'loading' | 'ok' | 'error' = 'loading';

	onMount(async () => {
		metadata = await getDocMetadata();
        status = isNullish(metadata) ? "error" : "ok";
	});
</script>

<h1 class="font-bold capitalize text-4xl mb-12">Proposal submitted</h1>

{#if status === 'loading'}
    <SpinnerText>Hold tight, loading metadata...</SpinnerText>
{:else if status === "ok"}
    <h2 class="text-2xl mb-6">Your proposal has already been submitted.</h2>

    <SubmitProposalNav proposalId={metadata?.data.proposalId} />
{:else}
    <div in:fade>
        <SubmitError />
    </div>
{/if}