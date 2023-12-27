import { busy } from '$lib/stores/busy.store';
import { toasts } from '$lib/stores/toasts.store';
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

export const setNeuron = async ({
	user,
	neuron,
	neuronId,
	governanceId
}: {
	user: UserOption;
	neuron: Doc<Neuron> | undefined;
	neuronId: string;
	governanceId: OptionGovernanceId;
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

	const updateData: Neuron = {
		...(nonNullish(neuron) && neuron.data),
		[governanceId]: [
			...(neuron?.data[governanceId]?.filter((nId) => neuronId !== nId) ?? []),
			neuronId
		]
	};

	try {
		const docNeuron = await setDoc<Neuron>({
			collection: 'neuron',
			doc: {
				key,
				data: updateData,
				...(nonNullish(neuron) && { updated_at: neuron.updated_at })
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
