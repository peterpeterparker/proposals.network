import { GOVERNANCE_CANISTER_ID } from '$lib/constants/app.constants';
import { toasts } from '$lib/stores/toasts.store';
import type { Neuron } from '$lib/types/juno';
import type { UserOption } from '$lib/types/user';
import { isNullish, nonNullish } from '@dfinity/utils';
import { getDoc, setDoc, type Doc } from '@junobuild/core';
import {busy} from "$lib/stores/busy.store";

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
	neuronId
}: {
	user: UserOption;
	neuron: Doc<Neuron> | undefined;
	neuronId: string;
}): Promise<{ result: 'ok' | 'error' }> => {
	if (isNullish(user)) {
		toasts.error({
			msg: { text: 'You are not signed in.' }
		});
		return { result: 'error' };
	}

	if (isNullish(GOVERNANCE_CANISTER_ID)) {
		toasts.error({
			msg: {
				text: 'The ICP governance canister ID is not set, therefore the neuron metadata cannot be saved.'
			}
		});
		return { result: 'error' };
	}

	busy.start();

	const { key } = user;

	const id = BigInt(neuronId);

	const updateData: Neuron = {
		...(nonNullish(neuron) && neuron.data),
		[GOVERNANCE_CANISTER_ID]: [
			...(neuron?.data[GOVERNANCE_CANISTER_ID].filter((nId) => id !== nId) ?? []),
			id
		]
	};

	try {
		await setDoc<Neuron>({
			collection: 'neuron',
			doc: {
				key,
				data: updateData,
				...(nonNullish(neuron) && { updated_at: neuron.updated_at })
			}
		});

		return { result: 'ok' };
	} catch (err: unknown) {
		toasts.error({
			msg: { text: 'Something went wrong while setting your neuron metadata.' },
			err
		});
		return { result: 'error' };
	} finally {
		busy.stop();
	}
};
