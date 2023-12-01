import { page } from '$app/stores';
import { derived, type Readable } from 'svelte/store';

export const routeKey: Readable<string | undefined | null> = derived(
	[page],
	([
		{
			data: { key }
		}
	]) => key
);
