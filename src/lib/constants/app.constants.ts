import { nonNullish } from '@dfinity/utils';

export const APP_VERSION = import.meta.env.VITE_APP_VERSION;

export const SATELLITE_ID: string | null | undefined = import.meta.env
	.VITE_SATELLITE_CANISTER_ID as string | null | undefined;

export const GOVERNANCE_CANISTER_ID: string | null | undefined = import.meta.env
	.VITE_NNS_GOVERNANCE_CANISTER_ID as string | null | undefined;

export const II_CANISTER_ID: string | null | undefined = import.meta.env
	.VITE_INTERNET_IDENTITY_CANISTER_ID as string | null | undefined;

export const HOST = nonNullish(II_CANISTER_ID) ? 'http://127.0.0.1:8000/' : 'https://icp-api.io';

export const LOCAL = import.meta.env.VITE_DFX_NETWORK === 'local';

export const PAGINATION = 10;
