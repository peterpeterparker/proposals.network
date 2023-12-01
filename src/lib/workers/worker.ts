import type { PostMessage, PostMessageDataRequest } from '$lib/types/post-message';
import type {User} from "@junobuild/core";
import {getLastChange, getProposals} from "$lib/services/idb.services";

import type {UserOption} from "$lib/types/user";
import {isNullish, nonNullish} from "@dfinity/utils";

onmessage = async ({ data: { msg, data } }: MessageEvent<PostMessage<PostMessageDataRequest>>) => {
	switch (msg) {
		case 'start':
			await startTimer(data?.user);
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

const startTimer = async (user: UserOption) => {
	// Avoid re-starting the timer
	if (nonNullish(timer)) {
		return;
	}

	if (isNullish(user)) {
		// We do nothing if no user
		console.error('Attempted to initiate a worker without a user.');
		return;
	}

	const execute = async () => await sync(user);

	// We starts now but also schedule the update after wards
	await execute();

	timer = setInterval(execute, 1000);
};

let inProgress = false;
let lastChangeProcessed: number | undefined = undefined;

const sync = async (user: UserOption) => {
	if (isNullish(user)) {
		return;
	}

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
        const entries = await getProposals();

		// TODO: save entries
        console.log(entries);

		// const [scene, metadata] = await Promise.all([getScene(), getMetadata()]);
        //
		// if (scene === undefined) {
		// 	throw new Error('No scene found.');
		// }
        //
		// if (metadata === undefined) {
		// 	throw new Error('No metadata found.');
		// }
        //
		// const { files, elements, ...rest } = scene;
		// const { key, ...restMetadata } = metadata;
        //
		// const satellite = {
		// 	identity: await unsafeIdentity(),
		// 	satelliteId: 'fqotu-wqaaa-aaaal-acp3a-cai'
		// };
        //
		// const doc = await getDoc<JunoScene>({
		// 	collection: 'scenes',
		// 	key,
		// 	satellite
		// });
        //
		// await setDoc<JunoScene>({
		// 	collection: 'scenes',
		// 	doc: {
		// 		...doc,
		// 		key,
		// 		data: {
		// 			elements,
		// 			...rest,
		// 			...restMetadata,
		// 			lastChange
		// 		}
		// 	},
		// 	satellite
		// });
        //
		// await uploadFiles({
		// 	elements,
		// 	files,
		// 	satellite,
		// 	key
		// });

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
