export const APP_VERSION = import.meta.env.VITE_APP_VERSION;

export const SATELLITE_ID: string | null | undefined = import.meta.env
	.VITE_SATELLITE_CANISTER_ID as string | null | undefined;
