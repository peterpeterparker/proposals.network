import { busy } from '$lib/stores/busy.store';
import { toasts } from '$lib/stores/toasts.store';
import { signIn as junoSignIn } from '@junobuild/core';

export const signIn = async (): Promise<{
	success: 'ok' | 'cancelled' | 'error';
	err?: unknown;
}> => {
	busy.show();

	try {
		await junoSignIn();

		// We clean previous messages in case user was signed out automatically before sign-in again.
		toasts.clean();

		return { success: 'ok' };
	} catch (err: unknown) {
		if (err === 'UserInterrupt') {
			// We do not display an error if user explicitly cancelled the process of sign-in
			return { success: 'cancelled' };
		}

		toasts.error({
			msg: { text: 'Something went wrong while sign-in.' },
			err
		});

		return { success: 'error', err };
	} finally {
		busy.stop();
	}
};
