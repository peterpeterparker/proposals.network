<script lang="ts">
	import Editor from '$lib/components/ui/Editor.svelte';
	import SubmitSteps from '$lib/components/submit/SubmitSteps.svelte';
	import { fade } from 'svelte/transition';
	import UserInitializedGuard from '$lib/components/guards/UserInitializedGuard.svelte';
	import { userNotSignedIn } from '$lib/derived/user.derived';
	import SubmitSignIn from "$lib/components/submit/SubmitSignIn.svelte";

	let step: 'sign-in' | 'write' | 'hotkey' | 'review' | 'submit' = 'sign-in';
</script>

<div class="flex flex-col lg:flex-row min-h-screen" in:fade>
	<SubmitSteps {step} />

	<UserInitializedGuard>
		<div
			class="w-full lg:w-[calc(100vw-300px)] lg:ml-[300px] px-4 lg:px-16 pt-9 lg:pt-36 pb-36 h-full"
		>
			{#if $userNotSignedIn}
				<SubmitSignIn />
			{:else}
				<Editor />
			{/if}
		</div>
	</UserInitializedGuard>
</div>
