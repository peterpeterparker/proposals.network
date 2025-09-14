<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { onAuthStateChange, initSatellite } from '@junobuild/core';
	import { userStore } from '$lib/stores/user.store';
	import { isNullish, nonNullish } from '@dfinity/utils';
	import { displayAndCleanLogoutMsg, toastAndReload } from '$lib/services/auth.services';
	import { junoEnvironment } from '$lib/utils/juno.utils';
	import { toasts } from '$lib/stores/toasts.store';
	import { initOrbiter } from '@junobuild/analytics';
	import {
		DEV,
		DISABLE_ANALYTICS,
		HOST,
		LOCAL,
		ORBITER_ID,
		SATELLITE_ID
	} from '$lib/constants/app.constants';

	let unsubscribe: (() => void) | undefined = undefined;

	onMount(async () => {
		const env = junoEnvironment();

		if (isNullish(env)) {
			toasts.error({
				msg: { text: 'Juno not initialized. Satellite ID is undefined or null.' }
			});
			return;
		}

		unsubscribe = onAuthStateChange((user) => userStore.set(user));

		if (!DISABLE_ANALYTICS && !LOCAL && nonNullish(ORBITER_ID)) {
			initOrbiter({
				options: {
					userAgentParser: true
				},
				satelliteId: SATELLITE_ID!,
				orbiterId: ORBITER_ID,
				...(DEV && { container: HOST })
			});
		}

		await Promise.all([
			initSatellite({
				...env,
				workers: {
					auth: true
				}
			})
		]);

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
