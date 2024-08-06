import type { ProposalAction } from '$lib/types/governance';

export type RouteParams = {
	key: string | null | undefined;
	id: string | null | undefined;
	g: string | null | undefined;
};

export type SubmitRouteParams = RouteParams & {
	action: ProposalAction | null | undefined;
	destination: string | null | undefined;
	amount: string | null | undefined;
};
