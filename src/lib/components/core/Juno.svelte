<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { authSubscribe, initJuno } from '@junobuild/core-peer';
	import { userStore } from '$lib/stores/user.store';
	import { isNullish } from '@dfinity/utils';
	import { displayAndCleanLogoutMsg, toastAndReload } from '$lib/services/auth.services';
	import { junoEnvironment } from '$lib/utils/juno.utils';
	import { toasts } from '$lib/stores/toasts.store';

	let unsubscribe: (() => void) | undefined = undefined;

	onMount(async () => {
		const env = junoEnvironment();

		if (isNullish(env)) {
			toasts.error({
				msg: { text: 'Juno not initialized. Satellite ID is undefined or null.' }
			});
			return;
		}

		unsubscribe = authSubscribe((user) => userStore.set(user));

		await initJuno({
			...env,
			workers: {
				auth: true
			}
		});

		displayAndCleanLogoutMsg();
	});

	const automaticSignOut = () =>
		toastAndReload({
			text: 'You have been logged out because your session has expired.',
			level: 'warn'
		});

	onDestroy(() => unsubscribe?.());
</script>

<svelte:window on:junoSignOutAuthTimer={automaticSignOut} />

<slot />
