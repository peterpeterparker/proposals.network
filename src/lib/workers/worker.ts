import { get, getLastChange } from '$lib/services/idb.services';
import type { PostMessage, PostMessageDataRequest } from '$lib/types/post-message';

import type { ProposalContent, ProposalMetadata } from '$lib/types/juno';
import { isNullish, nonNullish } from '@dfinity/utils';
import { getDoc, setManyDocs, unsafeIdentity } from '@junobuild/core';

onmessage = async ({ data: { msg, data } }: MessageEvent<PostMessage<PostMessageDataRequest>>) => {
	switch (msg) {
		case 'start':
			await startTimer(data);
			break;
		case 'stop':
			stopTimer();
			break;
	}
};

let timer: NodeJS.Timeout | undefined = undefined;

const stopTimer = () => {
	if (!timer) {
		return;
	}

	clearInterval(timer);
	timer = undefined;
};

const startTimer = async (data: PostMessageDataRequest | undefined) => {
	// Avoid re-starting the timer
	if (nonNullish(timer)) {
		return;
	}

	if (isNullish(data)) {
		// We do nothing if no user
		console.error('Attempted to initiate a worker without a user and satellite information.');
		return;
	}

	const execute = async () => await sync(data);

	// We starts now but also schedule the update after wards
	await execute();

	timer = setInterval(execute, 1000);
};

let inProgress = false;
let lastChangeProcessed: number | undefined = undefined;

const sync = async (data: PostMessageDataRequest) => {
	if (inProgress) {
		// Already in progress
		return;
	}

	const lastChange = await getLastChange();

	if (lastChange === undefined) {
		// There weren't any changes
		return;
	}

	if (lastChangeProcessed !== undefined && lastChange <= lastChangeProcessed) {
		// No new changes
		return;
	}

	inProgress = true;

	postMessage({
		msg: 'busy'
	});

	try {
		const value = await get();

		if (isNullish(value)) {
			return;
		}

		const [key, title, contentData] = value;

		const { user, governanceId, localIdentityCanisterId, ...rest } = data;

		const satellite = {
			identity: await unsafeIdentity(),
			...rest,
			...(nonNullish(localIdentityCanisterId) && { env: 'dev' as 'dev' })
		};

		const [metadata, content] = await Promise.all([
			getDoc<ProposalMetadata>({
				collection: 'metadata',
				key,
				satellite
			}),
			getDoc<ProposalContent>({
				collection: 'content',
				key,
				satellite
			})
		]);

		await setManyDocs({
			satellite,
			docs: [
				{
					collection: 'metadata',
					doc: {
						key,
						description: governanceId,
						data: {
							title,
							lastChange
						},
						...(nonNullish(metadata) && { updated_at: metadata.updated_at })
					}
				},
				{
					collection: 'content',
					doc: {
						key,
						data: contentData,
						...(nonNullish(content) && { updated_at: content.updated_at })
					}
				}
			]
		});

		// Save timestamp to skip further changes if no changes
		lastChangeProcessed = lastChange;
	} catch (err: unknown) {
		console.error(err);

		// In case of error we stop the sync
		stopTimer();
	}

	inProgress = false;

	postMessage({
		msg: 'idle'
	});
};

export {};
