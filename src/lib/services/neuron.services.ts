import { toasts } from '$lib/stores/toasts.store';
import type { Neuron } from '$lib/types/juno';
import type { UserOption } from '$lib/types/user';
import { isNullish } from '@dfinity/utils';
import { getDoc, type Doc } from '@junobuild/core';

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
