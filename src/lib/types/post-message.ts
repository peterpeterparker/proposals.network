import type {UserOption} from "$lib/types/user";

export type PostMessageDataRequest = {
	user: UserOption;
};
export type PostMessageDataResponse = object;

export type PostMessageRequest = 'start' | 'stop' | 'busy' | 'idle';
export type PostMessageResponse = object;

export interface PostMessage<T extends PostMessageDataRequest | PostMessageDataResponse> {
	msg: PostMessageRequest | PostMessageResponse;
	data?: T;
}
