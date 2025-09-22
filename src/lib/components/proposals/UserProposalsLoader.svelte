<script lang="ts">
	import { userNotInitialized, userNotSignedIn } from '$lib/derived/user.derived';
	import { userProposalsStore } from '$lib/stores/user-proposals.store';
	import { loadUserProposals } from '$lib/services/loader-stores.services';
	import { governanceIdStore } from '$lib/derived/governance.derived';
	import { userStore } from '$lib/stores/user.store';

	const load = async () => {
		if ($userNotInitialized) {
			return;
		}

		if ($userNotSignedIn) {
			userProposalsStore.reset();
			return;
		}

		await loadUserProposals({ startAfter: undefined, governanceId: $governanceIdStore });
	};

	$: ($userStore, $governanceIdStore, (async () => load())());
</script>

<slot />
