import { wizardBusy } from '$lib/stores/busy.store';
import type {
	PostMessage,
	PostMessageDataRequest,
	PostMessageDataResponse
} from '$lib/types/post-message';
import { nonNullish } from '@dfinity/utils';

export interface ProposalWorker {
	sync: (data: PostMessageDataRequest) => void;
}

export const initWorker = async (): Promise<ProposalWorker> => {
	const ProposalsWorker = await import('$lib/workers/worker?worker');
	const worker: Worker = new ProposalsWorker.default();

	worker.onmessage = async ({ data }: MessageEvent<PostMessage<PostMessageDataResponse>>) => {
		const { msg   } = data;

		switch (msg) {
			case 'busy':
				wizardBusy.start((data.data as PostMessageDataResponse).workerId);
				return;
			case 'idle':
				wizardBusy.stop((data.data as PostMessageDataResponse).workerId);
				return;
		}
	};

	return {
		sync: ({ user, ...rest }: PostMessageDataRequest) => {
			worker.postMessage({
				msg: nonNullish(user) ? 'start' : 'stop',
				data: {
					user,
					...rest
				}
			});
		}
	};
};
