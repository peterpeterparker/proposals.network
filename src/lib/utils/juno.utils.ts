import { GOVERNANCE_CANISTER_ID, II_CANISTER_ID, SATELLITE_ID } from '$lib/constants/app.constants';
import type { Neuron } from '$lib/types/juno';
import { isNullish, nonNullish } from '@dfinity/utils';
import type { Doc, Environment } from '@junobuild/core';

export const junoEnvironment = ():
	| Pick<Environment, 'satelliteId' | 'localIdentityCanisterId'>
	| undefined =>
	isNullish(SATELLITE_ID)
		? undefined
		: {
				satelliteId: SATELLITE_ID,
				...(nonNullish(II_CANISTER_ID) && { localIdentityCanisterId: II_CANISTER_ID })
		  };

export const firstNeuronId = (neuron: Doc<Neuron> | undefined): bigint | undefined => {
	if (isNullish(GOVERNANCE_CANISTER_ID)) {
		return undefined;
	}

	return neuron?.data[GOVERNANCE_CANISTER_ID][0];
};
