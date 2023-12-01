import { II_CANISTER_ID, SATELLITE_ID } from '$lib/constants/app.constants';
import { isNullish, nonNullish } from '@dfinity/utils';
import type { Environment } from '@junobuild/core';

export const junoEnvironment = ():
	| Pick<Environment, 'satelliteId' | 'localIdentityCanisterId'>
	| undefined =>
	isNullish(SATELLITE_ID)
		? undefined
		: {
				satelliteId: SATELLITE_ID,
				...(nonNullish(II_CANISTER_ID) && { localIdentityCanisterId: II_CANISTER_ID })
		  };
