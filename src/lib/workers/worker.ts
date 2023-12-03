import {
	getLastChangeContent,
	getLastChangeMetadata,
	getLastJobContent,
	getLastJobMetadata
} from '$lib/services/idb.services';
import type { PostMessage, PostMessageDataRequest } from '$lib/types/post-message';
import { WorkerSync } from '$lib/workers/worker.sync';
import { syncContent } from '$lib/workers/worker.sync.content';
import { syncMetadata } from '$lib/workers/worker.sync.metadata';

const metadataSync = new WorkerSync({
	workerId: 'metadata',
	getLastChange: getLastChangeMetadata,
	getLastJob: getLastJobMetadata,
	syncData: syncMetadata
});

const contentSync = new WorkerSync({
	workerId: 'content',
	getLastChange: getLastChangeContent,
	getLastJob: getLastJobContent,
	syncData: syncContent
});

onmessage = async ({ data: { msg, data } }: MessageEvent<PostMessage<PostMessageDataRequest>>) => {
	switch (msg) {
		case 'start':
			await Promise.all([metadataSync.startTimer(data), contentSync.startTimer(data)]);
			break;
		case 'stop':
			await Promise.all([metadataSync.stopTimer(), contentSync.stopTimer()]);
			break;
	}
};

export {};
