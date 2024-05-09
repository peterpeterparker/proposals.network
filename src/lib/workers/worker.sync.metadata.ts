import { getMetadata, updateMetadataDoc } from '$lib/services/idb.services';
import type { ProposalMetadata } from '$lib/types/juno';
import type { WorkerSyncParams } from '$lib/workers/worker.sync';
import { isNullish, nonNullish } from '@dfinity/utils';
import { setDoc } from '@junobuild/core-peer';

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
			description: docMetadata?.description ?? governanceId,
			data: metadataData,
			...(nonNullish(docMetadata) && { version: docMetadata.version })
		}
	});

	await updateMetadataDoc({ docMetadata: doc });
};
