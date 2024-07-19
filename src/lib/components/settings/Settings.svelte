<script lang="ts">
	import SplitPane from '$lib/components/ui/SplitPane.svelte';
	import UserInitializedGuard from '$lib/components/guards/UserInitializedGuard.svelte';
	import { userNotSignedIn } from '$lib/derived/user.derived';
    import SettingsSignIn from "$lib/components/settings/SettingsSignIn.svelte";
	import SubmitTitle from "$lib/components/submit/SubmitTitle.svelte";
</script>

<SplitPane col="reverse">
	<UserInitializedGuard>
		{#if $userNotSignedIn}
            <SettingsSignIn />
		{:else}
			<SubmitTitle>Your Settings</SubmitTitle>
		{/if}
	</UserInitializedGuard>
</SplitPane>
