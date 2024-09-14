<script lang="ts">
	import Aside from '$lib/components/core/Aside.svelte';
	import SplitPane from '$lib/components/ui/SplitPane.svelte';
	import SignInSection from '$lib/components/core/SignInSection.svelte';
	import Title from '$lib/components/ui/Title.svelte';
	import UserInitializedGuard from '$lib/components/guards/UserInitializedGuard.svelte';
	import { userNotSignedIn } from '$lib/derived/user.derived';
	import UserProposals from '$lib/components/proposals/UserProposals.svelte';
</script>

<SplitPane col="forward">
	<Aside slot="aside" />

	<UserInitializedGuard>
		{#if $userNotSignedIn}
			<SignInSection />
		{:else}
			<Title>Your Proposals</Title>

			<UserProposals hideAction deleteAction />
		{/if}
	</UserInitializedGuard>
</SplitPane>
