import type { WizardBusyData } from '$lib/stores/busy.store';
import type { UserOption } from '$lib/types/user';
import type { Environment } from '@junobuild/core';

export type PostMessageDataRequest = {
	user: UserOption;
	governanceId: string;
} & Pick<Environment, 'satelliteId' | 'localIdentityCanisterId'>;
export type PostMessageDataResponse = { workerId: keyof WizardBusyData };

export type PostMessageRequest = 'start' | 'stop' | 'busy' | 'idle';
export type PostMessageResponse = object;

export interface PostMessage<T extends PostMessageDataRequest | PostMessageDataResponse> {
	msg: PostMessageRequest | PostMessageResponse;
	data?: T;
}
