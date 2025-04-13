import { getContent, updateContentDoc } from '$lib/services/idb.services';
import type { WorkerSyncParams } from '$lib/workers/worker.sync';
import { isNullish, nonNullish } from '@dfinity/utils';
import { setDoc } from '@junobuild/core';

export const syncContent = async ({ satellite }: WorkerSyncParams) => {
	const value = await getContent();

	if (isNullish(value)) {
		console.error('Empty content state');
		return;
	}

	const [key, editableContent, docContent] = value;

	const doc = await setDoc({
		satellite,
		collection: 'content',
		doc: {
			key,
			data: editableContent ?? '',
			...(nonNullish(docContent) && { version: docContent.version })
		}
	});

	const { data: _jsonContent, ...updatedContentMetadata } = doc;

	await updateContentDoc({ docContent: updatedContentMetadata });
};
