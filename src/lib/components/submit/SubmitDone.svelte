<script lang="ts">
	import Confetti from '$lib/components/ui/Confetti.svelte';
	import IconCelebration from '$lib/components/icons/IconCelebration.svelte';
	import SubmitProposalNav from '$lib/components/submit/SubmitProposalNav.svelte';

	export let proposalId: bigint | undefined;
</script>

<h1 class="font-bold capitalize text-4xl mb-12 inline-flex items-center gap-2">
	Hooray! <IconCelebration />
</h1>

<h2 class="text-2xl mb-6">Your proposal has been submitted successfully!</h2>

<SubmitProposalNav {proposalId} />

<Confetti />
