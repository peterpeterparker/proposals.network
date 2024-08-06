import type { SubmitRouteParams } from '$lib/types/nav';
import { loadSubmitRouteParams } from '$lib/utils/nav.utils';
import type { LoadEvent } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ($event: LoadEvent): SubmitRouteParams =>
	loadSubmitRouteParams($event);
