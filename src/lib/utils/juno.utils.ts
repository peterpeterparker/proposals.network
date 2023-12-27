import { II_CANISTER_ID, SATELLITE_ID } from '$lib/constants/app.constants';
import type { OptionGovernanceId } from '$lib/types/governance';
import type { Neuron } from '$lib/types/juno';
import { isNullish, nonNullish } from '@dfinity/utils';
import type { Doc, Environment } from '@junobuild/core-peer';

export const junoEnvironment = ():
	| Pick<Environment, 'satelliteId' | 'localIdentityCanisterId'>
	| undefined =>
	isNullish(SATELLITE_ID)
		? undefined
		: {
				satelliteId: SATELLITE_ID,
				...(nonNullish(II_CANISTER_ID) && { localIdentityCanisterId: II_CANISTER_ID })
			};

export const firstNeuronId = ({
	neuron,
	governanceId
}: {
	neuron: Doc<Neuron> | undefined;
	governanceId: OptionGovernanceId;
}): bigint | undefined => {
	if (isNullish(governanceId)) {
		return undefined;
	}

	return neuron?.data[governanceId][0];
};
