import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import type { LoadEvent, Page } from '@sveltejs/kit';

export const isRouteSubmit = ({ route: { id } }: Page): boolean => id === '/(split)/submit';

export const submitUrl = (key: string): string => `/submit/?key=${key}`;

export const back = async (pop: boolean) => {
	if (!pop) {
		await goto('/');
		return;
	}

	history.back();
};

export type RouteParams = {
	key: string | null | undefined;
};

export const loadRouteParams = ($event: LoadEvent): RouteParams => {
	if (!browser) {
		return {
			key: undefined
		};
	}

	const {
		url: { searchParams }
	} = $event;

	return {
		key: searchParams?.get('key')
	};
};
