import type { RouteParams } from '$lib/types/nav';
import { loadRouteParams } from '$lib/utils/nav.utils';
import type { LoadEvent } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ($event: LoadEvent): RouteParams => loadRouteParams($event);
