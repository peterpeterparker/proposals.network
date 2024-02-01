<script lang="ts">
    import type { ProposalContent } from '$lib/types/juno';
    import type { ProposalEditableMetadata } from '$lib/types/juno';
    import SubmitWriteEdit from '$lib/components/submit/SubmitWriteEdit.svelte';
    import { getEditable } from '$lib/services/idb.services';
    import { onMount } from 'svelte';

    let metadata: ProposalEditableMetadata | undefined;
    let content: ProposalContent | undefined;

    onMount(async () => ([metadata, content] = await getEditable()));
</script>

<h1 class="mb-12 text-4xl font-bold capitalize md:text-6xl">Craft Your Proposal</h1>

<h2 class="mb-6 text-2xl">
    To submit a motion proposal, you need both a summary (explaining what it's all about) and motion text
    (the effective motion for voting), along with a title and a URL pointing to your community
    discussion.
</h2>

<SubmitWriteEdit {metadata} {content} />