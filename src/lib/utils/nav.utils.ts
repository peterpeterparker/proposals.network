import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import type { OptionGovernanceId } from '$lib/types/governance';
import type { RouteParams } from '$lib/types/nav';
import { isNullish, nonNullish } from '@dfinity/utils';
import type { LoadEvent } from '@sveltejs/kit';

export const homeUrl = (param: Pick<GovernanceIdParam, 'governanceId'>): string =>
	`/?${governanceParam({ ...param, separator: false })}`;

export const submitUrl = (param: Pick<GovernanceIdParam, 'governanceId'>): string =>
	`/submit/?${governanceParam({ ...param, separator: false })}`;

export const userProposalUrl = ({
	key,
	governanceId
}: { key: string } & Pick<GovernanceIdParam, 'governanceId'>): string =>
	`/submit/?${governanceParam({ governanceId, separator: true })}key=${key}`;

export const proposalUrl = ({
	id,
	governanceId
}: { id: string | number } & Pick<GovernanceIdParam, 'governanceId'>): string =>
	`/proposal/?${governanceParam({ governanceId, separator: true })}id=${id}`;

export interface GovernanceIdParam {
	governanceId: OptionGovernanceId;
	separator: boolean;
}

const governanceParam = ({ governanceId, separator }: GovernanceIdParam): string => {
	const defined = nonNullish(governanceId) && governanceId !== '';
	return defined ? `g=${governanceId}${separator ? '&' : ''}` : '';
};

export const switchGovernance = async (governanceId: OptionGovernanceId) => {
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
