<script lang="ts">
	import SubmitSteps from '$lib/components/submit/SubmitSteps.svelte';
	import { fade } from 'svelte/transition';
	import UserInitializedGuard from '$lib/components/guards/UserInitializedGuard.svelte';
	import { userNotSignedIn } from '$lib/derived/user.derived';
	import SubmitSignIn from '$lib/components/submit/SubmitSignIn.svelte';
	import SubmitWrite from '$lib/components/submit/SubmitWrite.svelte';
	import type { ProposalContent } from '$lib/types/juno';
	import { routeKey } from '$lib/derived/nav.derived';
	import { userStore } from '$lib/stores/user.store';
	import { initUserProposal } from '$lib/services/user-proposal.services';
	import { goto } from '$app/navigation';

	let step: undefined | 'write' | 'hotkey' | 'review' | 'submit' = undefined;

	let content: ProposalContent | undefined;
	let key: string | undefined;

	const init = async () => {
		const {
			result,
			key: proposalKey,
			content: jsonContent
		} = await initUserProposal({ user: $userStore, routeKey: $routeKey });

		if (result === 'error') {
			await goto('/', { replaceState: true });
			return;
		}

		key = proposalKey;
		content = jsonContent;
	};

	$: $userStore, $routeKey, (async () => await init())();
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
				<SubmitWrite {content} />
			{/if}
		</div>
	</UserInitializedGuard>
</div>
