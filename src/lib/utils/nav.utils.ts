import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import type { GovernanceId } from '$lib/types/governance';
import type { RouteParams } from '$lib/types/nav';
import { isNullish } from '@dfinity/utils';
import type { LoadEvent, Page } from '@sveltejs/kit';

export const isRouteSubmit = ({ route: { id } }: Page): boolean => id === '/(split)/submit';

export const submitUrl = (key: string): string => `/submit/?key=${key}`;

export const switchGovernance = async (governanceId: GovernanceId | undefined | null) => {
	const url = new URL(window.location.href);

	if (isNullish(governanceId)) {
		url.searchParams.delete('g');
	} else {
		url.searchParams.set('g', governanceId);
	}

	await goto(url, {
		replaceState: true,
		noScroll: true,
		keepFocus: true
	});
};

export const back = async (pop: boolean) => {
	if (!pop) {
		await goto('/');
		return;
	}

	history.back();
};

export const loadRouteParams = ($event: LoadEvent): RouteParams => {
	if (!browser) {
		return {
			key: undefined,
			id: undefined,
			g: undefined
		};
	}

	const {
		url: { searchParams }
	} = $event;

	return {
		key: searchParams?.get('key'),
		id: searchParams?.get('id'),
		g: searchParams?.get('g')
	};
};
