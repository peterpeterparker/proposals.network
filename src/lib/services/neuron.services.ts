import { busy } from '$lib/stores/busy.store';
import { toasts } from '$lib/stores/toasts.store';
import type { GovernanceCanisterId } from '$lib/types/core';
import type { OptionGovernanceId } from '$lib/types/governance';
import type { Neuron } from '$lib/types/juno';
import type { UserOption } from '$lib/types/user';
import { isNullish, nonNullish } from '@dfinity/utils';
import { getDoc, setDoc, type Doc } from '@junobuild/core-peer';

export const getNeuron = async (
	user: UserOption
): Promise<{ result: 'ok' | 'error'; neuron: Doc<Neuron> | undefined }> => {
	if (isNullish(user)) {
		toasts.error({
			msg: { text: 'You are not signed in.' }
		});
		return { result: 'error', neuron: undefined };
	}

	const { key } = user;

	try {
		const neuron = await getDoc<Neuron>({
			collection: 'neuron',
			key
		});

		return { result: 'ok', neuron };
	} catch (err: unknown) {
		toasts.error({
			msg: { text: 'Something went wrong while getting your neuron metadata.' },
			err
		});
		return { result: 'error', neuron: undefined };
	}
};

export const deleteNeuronId = async ({
	neuron,
	neuronId,
	...rest
}: {
	user: UserOption;
	neuron: Doc<Neuron> | undefined;
	neuronId: string;
	governanceId: OptionGovernanceId;
}): Promise<{ result: 'ok' | 'error'; neuron: Doc<Neuron> | undefined }> => {
	const prepareNeuronData = (governanceId: GovernanceCanisterId): Neuron => {
		const data = {
			...(nonNullish(neuron) && neuron.data),
			[governanceId]: [...(neuron?.data[governanceId]?.filter((nId) => neuronId !== nId) ?? [])]
		};

		if (data[governanceId].length > 0) {
			return data;
		}

		const { [governanceId]: _excludeValue, ...rest } = data;

		return {
			...rest
		};
	};

	return await saveNeuron({
		neuron,
		neuronId,
		prepareNeuronData,
		...rest
	});
};

export const setNeuron = async ({
	neuron,
	neuronId,
	...rest
}: {
	user: UserOption;
	neuron: Doc<Neuron> | undefined;
	neuronId: string;
	governanceId: OptionGovernanceId;
}): Promise<{ result: 'ok' | 'error'; neuron: Doc<Neuron> | undefined }> => {
	const prepareNeuronData = (governanceId: GovernanceCanisterId): Neuron => ({
		...(nonNullish(neuron) && neuron.data),
		[governanceId]: [
			...(neuron?.data[governanceId]?.filter((nId) => neuronId !== nId) ?? []),
			neuronId
		]
	});

	return await saveNeuron({
		neuron,
		neuronId,
		prepareNeuronData,
		...rest
	});
};

const saveNeuron = async ({
	user,
	neuron,
	neuronId,
	governanceId,
	prepareNeuronData
}: {
	user: UserOption;
	neuron: Doc<Neuron> | undefined;
	neuronId: string;
	governanceId: OptionGovernanceId;
	prepareNeuronData: (governanceId: GovernanceCanisterId) => Neuron;
}): Promise<{ result: 'ok' | 'error'; neuron: Doc<Neuron> | undefined }> => {
	if (isNullish(user)) {
		toasts.error({
			msg: { text: 'You are not signed in.' }
		});
		return { result: 'error', neuron: undefined };
	}

	if (isNullish(governanceId)) {
		toasts.error({
			msg: {
				text: 'The canister ID of the governance is not set, therefore the neuron metadata cannot be saved.'
			}
		});
		return { result: 'error', neuron: undefined };
	}

	busy.start();

	const { key } = user;

	const updateData: Neuron = prepareNeuronData(governanceId);

	try {
		const docNeuron = await setDoc<Neuron>({
			collection: 'neuron',
			doc: {
				key,
				data: updateData,
				...(nonNullish(neuron) && { version: neuron.version })
			}
		});

		return { result: 'ok', neuron: docNeuron };
	} catch (err: unknown) {
		toasts.error({
			msg: { text: 'Something went wrong while setting your neuron metadata.' },
			err
		});
		return { result: 'error', neuron: undefined };
	} finally {
		busy.stop();
	}
};
