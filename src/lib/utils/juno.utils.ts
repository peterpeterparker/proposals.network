import { DEV, HOST, II_CANISTER_ID, SATELLITE_ID } from '$lib/constants/app.constants';
import type { OptionGovernanceId } from '$lib/types/governance';
import type { Neuron } from '$lib/types/juno';
import { isNullish, nonNullish } from '@dfinity/utils';
import type { Doc, Environment } from '@junobuild/core';

export const junoEnvironment = ():
	| Pick<Environment, 'satelliteId' | 'internetIdentityId' | 'container'>
	| undefined =>
	isNullish(SATELLITE_ID)
		? undefined
		: {
				satelliteId: SATELLITE_ID,
				...(nonNullish(II_CANISTER_ID) && { internetIdentityId: II_CANISTER_ID }),
				...(DEV && { container: HOST })
			};

export const firstNeuronId = ({
	neuron,
	governanceId
}: {
	neuron: Doc<Neuron> | undefined;
	governanceId: OptionGovernanceId;
}): string | undefined => {
	if (isNullish(governanceId)) {
		return undefined;
	}

	const neuronId = neuron?.data[governanceId]?.[0];

	return nonNullish(neuronId) ? `${neuronId}` : undefined;
};
