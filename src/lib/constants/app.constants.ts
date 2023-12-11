import { nonNullish } from '@dfinity/utils';

export const APP_VERSION = import.meta.env.VITE_APP_VERSION;

export const LOCAL = import.meta.env.VITE_DFX_NETWORK === 'local';

export const DISABLE_ANALYTICS = import.meta.env.VITE_JUNO_DISABLE_ANALYTICS === true;

export const SATELLITE_ID: string | null | undefined = import.meta.env
	.VITE_SATELLITE_CANISTER_ID as string | null | undefined;

export const GOVERNANCE_CANISTER_ID: string | null | undefined = import.meta.env
	.VITE_NNS_GOVERNANCE_CANISTER_ID as string | null | undefined;

export const II_CANISTER_ID: string | null | undefined = LOCAL
	? (import.meta.env.VITE_INTERNET_IDENTITY_CANISTER_ID as string | null | undefined)
	: undefined;

export const HOST = nonNullish(II_CANISTER_ID) ? 'http://127.0.0.1:8000/' : 'https://icp-api.io';

export const USER_PAGINATION = 5;
export const NETWORK_PAGINATION = 10;

export const E8S_PER_ICP = 100_000_000;

// How long the delegation identity should remain valid?
// e.g. BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000) = 7 days in nanoseconds
export const AUTH_MAX_TIME_TO_LIVE = BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000);
