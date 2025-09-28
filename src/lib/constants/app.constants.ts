import type { OptionGovernanceId } from '$lib/types/governance';

export const APP_VERSION = import.meta.env.VITE_APP_VERSION;

export const DEV = import.meta.env.DEV;

export const DISABLE_ANALYTICS = import.meta.env.VITE_JUNO_DISABLE_ANALYTICS === true;

export const SATELLITE_ID: string | null | undefined = import.meta.env.VITE_SATELLITE_ID;

export const ORBITER_ID: string | null | undefined = DEV
	? undefined
	: import.meta.env.VITE_ORBITER_ID;

export const GOVERNANCE_CANISTER_ID: OptionGovernanceId = import.meta.env
	.VITE_NNS_GOVERNANCE_ID as OptionGovernanceId;

export const II_CANISTER_ID: string | null | undefined = import.meta.env.VITE_INTERNET_IDENTITY_ID;

export const HOST = import.meta.env.DEV ? import.meta.env.VITE_CONTAINER : 'https://icp-api.io';

export const USER_PAGINATION = 5;
export const NETWORK_PAGINATION = 10;

export const E8S_PER_ICP = 100_000_000;

// How long the delegation identity should remain valid?
// e.g. BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000) = 7 days in nanoseconds
export const AUTH_MAX_TIME_TO_LIVE = BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000);
