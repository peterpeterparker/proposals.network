<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { authSubscribe, initJuno } from '@junobuild/core';
	import { userStore } from '$lib/stores/user.store';
	import { II_CANISTER_ID, SATELLITE_ID } from '$lib/constants/app.constants';
	import { isNullish, nonNullish } from '@dfinity/utils';
    import {displayAndCleanLogoutMsg, toastAndReload} from '$lib/services/auth.services';

	let unsubscribe: (() => void) | undefined = undefined;

	onMount(async () => {
		if (isNullish(SATELLITE_ID)) {
			console.error('Juno not initialized. Satellite ID is undefined or null.');
			return;
		}

		unsubscribe = authSubscribe((user) => userStore.set(user));

		await initJuno({
			satelliteId: SATELLITE_ID,
			...(nonNullish(II_CANISTER_ID) && { localIdentityCanisterId: II_CANISTER_ID }),
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
