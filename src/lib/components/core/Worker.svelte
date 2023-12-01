<script lang="ts">
	import { userStore } from '$lib/stores/user.store';
	import type { ProposalWorker } from '$lib/services/worker.services';
	import { initWorker } from '$lib/services/worker.services';
	import { onMount } from 'svelte';
	import { junoEnvironment } from '$lib/utils/juno.utils';
	import { isNullish } from '@dfinity/utils';
    import {GOVERNANCE_CANISTER_ID} from "$lib/constants/app.constants";
    import {toasts} from "$lib/stores/toasts.store";

	let worker: ProposalWorker | undefined;

	onMount(async () => (worker = await initWorker()));

	$: worker,
		$userStore,
		(() => {
			const env = junoEnvironment();

			if (isNullish(env)) {
				toasts.error({
                    msg: { text: 'Juno environment not initialized. Therefore worker cannot be synced.' }
                });
				return;
			}

            if (isNullish(GOVERNANCE_CANISTER_ID)) {
                toasts.error({
                    msg: { text: 'No governance canister ID defined.' }
                });
                return;
            }

			worker?.sync({
				user: $userStore,
                governanceId: GOVERNANCE_CANISTER_ID,
				...env
			});
		})();
</script>

<slot />
