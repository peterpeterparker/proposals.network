<script lang="ts">
	import { userStore } from '$lib/stores/user.store';
	import type { ProposalWorker } from '$lib/services/worker.services';
	import { initWorker } from '$lib/services/worker.services';
	import { onMount } from 'svelte';

	let worker: ProposalWorker | undefined;

	onMount(async () => (worker = await initWorker()));

	$: worker, $userStore, (() => worker?.sync($userStore))();
</script>

<slot />
