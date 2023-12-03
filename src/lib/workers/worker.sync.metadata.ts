import { getMetadata, updateMetadataDoc } from '$lib/services/idb.services';
import type { ProposalMetadata } from '$lib/types/juno';
import type { WorkerSyncParams } from '$lib/workers/worker.sync';
import { isNullish, nonNullish } from '@dfinity/utils';
import { setDoc } from '@junobuild/core';

export const syncMetadata = async ({ satellite, governanceId }: WorkerSyncParams) => {
	const value = await getMetadata();

	if (isNullish(value)) {
		console.error('Empty metadata state');
		return;
	}

	const [key, editableMetadata, docMetadata] = value;

	const metadataData: ProposalMetadata = {
		status: 'draft',
		...(nonNullish(docMetadata) && docMetadata.data),
		...(nonNullish(editableMetadata) && editableMetadata)
	};

	const doc = await setDoc({
		satellite,
		collection: 'metadata',
		doc: {
			key,
			description: governanceId,
			data: metadataData,
			...(nonNullish(docMetadata) && { updated_at: docMetadata.updated_at })
		}
	});

	await updateMetadataDoc({ docMetadata: doc });
};
