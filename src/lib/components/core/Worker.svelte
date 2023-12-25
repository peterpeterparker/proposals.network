<script lang="ts">
	import { userStore } from '$lib/stores/user.store';
	import type { ProposalWorker } from '$lib/services/worker.services';
	import { initWorker } from '$lib/services/worker.services';
	import { onMount } from 'svelte';
	import { junoEnvironment } from '$lib/utils/juno.utils';
	import { isNullish } from '@dfinity/utils';
	import { toasts } from '$lib/stores/toasts.store';
	import { governanceIdStore } from '$lib/derived/governance.derived';

	let worker: ProposalWorker | undefined;

	onMount(async () => (worker = await initWorker()));

	$: worker,
		$governanceIdStore,
		$userStore,
		(() => {
			const env = junoEnvironment();

			if (isNullish(env)) {
				toasts.error({
					msg: { text: 'Juno environment not initialized. Therefore worker cannot be synced.' }
				});
				return;
			}

			if (isNullish($governanceIdStore)) {
				toasts.error({
					msg: { text: 'No governance ID defined.' }
				});
				return;
			}

			worker?.sync({
				user: $userStore,
				governanceId: $governanceIdStore,
				...env
			});
		})();
</script>

<slot />
