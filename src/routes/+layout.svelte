<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { authSubscribe, initJuno } from '@junobuild/core';
	import { userStore } from '$lib/stores/user.store';
	import { SATELLITE_ID } from '$lib/constants/app.constants';
	import { isNullish } from '@dfinity/utils';

	let unsubscribe: (() => void) | undefined = undefined;

	onMount(async () => {
		if (isNullish(SATELLITE_ID)) {
			console.error('Juno not initialized. Satellite ID is undefined or null.');
			return;
		}

		unsubscribe = authSubscribe((user) => userStore.set(user));

		await initJuno({
			satelliteId: SATELLITE_ID
		});
	});

	onDestroy(() => unsubscribe?.());
</script>

<slot />
