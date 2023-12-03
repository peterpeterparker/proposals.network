import { getContent, updateContentDoc } from '$lib/services/idb.services';
import { isNullish, nonNullish } from '@dfinity/utils';
import { type SatelliteOptions, setDoc } from '@junobuild/core';

export const syncContent = async ({
	satellite,
	governanceId
}: {
	satellite: SatelliteOptions;
	governanceId: string;
}) => {
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
			data: editableContent,
			...(nonNullish(docContent) && { updated_at: docContent.updated_at })
		}
	});

	const { data: _jsonContent, ...updatedContentMetadata } = doc;

	await updateContentDoc({ docContent: updatedContentMetadata });
};
