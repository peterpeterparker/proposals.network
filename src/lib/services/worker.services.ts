import type { PostMessage, PostMessageDataResponse } from '$lib/types/post-message';
import { nonNullish } from '@dfinity/utils';

import type { UserOption } from '$lib/types/user';

export interface ProposalWorker {
	sync: (user: UserOption) => void;
}

export const initWorker = async () => {
	const ProposalsWorker = await import('$lib/workers/worker?worker');
	const worker: Worker = new ProposalsWorker.default();

	worker.onmessage = async ({ data }: MessageEvent<PostMessage<PostMessageDataResponse>>) => {
		const { msg } = data;
		// TODO:
		//  const { msg } = data;
		//           setBusy(msg === "busy");
		console.log('MSG:', msg);
	};

	return {
		sync: (user: UserOption) => {
			worker.postMessage({
				msg: nonNullish(user) ? 'start' : 'stop',
				data: {
					user
				}
			});
		}
	};
};
