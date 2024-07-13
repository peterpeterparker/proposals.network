<script lang="ts">
	import SubmitMotionEdit from '$lib/components/submit/SubmitMotionEdit.svelte';
	import SubmitTitle from '$lib/components/submit/SubmitTitle.svelte';
	import SubmitContinue from '$lib/components/submit/SubmitContinue.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	const next = () => dispatch('pnwrkNext');
</script>

<SubmitTitle>Craft Your Motion</SubmitTitle>

<h2 class="mb-6 text-2xl">
	To submit a motion proposal, you need both a summary (explaining what it's all about) and motion
	text (the effective motion for voting), along with a title and a URL pointing to your community
	discussion.
</h2>

<SubmitMotionEdit />

<SubmitContinue on:click={next} />
