<script lang="ts">
    import type { ProposalContent } from '$lib/types/juno';
    import type { ProposalEditableMetadata } from '$lib/types/juno';
    import SubmitWriteEdit from '$lib/components/submit/SubmitWriteEdit.svelte';

    export let metadata: ProposalEditableMetadata | undefined;
    export let content: ProposalContent | undefined;
</script>

<h1 class="mb-12 text-4xl font-bold capitalize md:text-6xl">Craft Your Proposal</h1>

<h2 class="mb-6 text-2xl">
    To submit a motion proposal, you need both a summary (explaining what it's all about) and motion text
    (the effective motion for voting), along with a title and a URL pointing to your community
    discussion.
</h2>

<SubmitWriteEdit {metadata} {content} />