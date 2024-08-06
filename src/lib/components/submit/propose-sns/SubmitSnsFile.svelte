<script lang="ts">
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import { getContext } from 'svelte';
	import { getEditableAssets } from '$lib/services/idb.services';
	import { isNullish, nonNullish } from '@dfinity/utils';
	import { snsAssetFullPath } from '$lib/services/submit.sns.services';
	import { downloadUrl as downloadUrlLib } from '@junobuild/core-peer';
	import type { StorageSnsCollections } from '$lib/types/juno';

	export let collection: StorageSnsCollections;
	export let extension: 'yaml' | 'png';
	export let downloadUrl: string | undefined;

	const { store }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);

	const init = async () => {
		if (isNullish($store?.key)) {
			return;
		}

		const fullPath = snsAssetFullPath({
			key: $store.key,
			extension,
			collection
		});

		const assets = await getEditableAssets();
		const asset = assets?.find(({ fullPath: f }) => f === fullPath);

		downloadUrl = nonNullish(asset)
			? downloadUrlLib({
					assetKey: {
						fullPath,
						token: asset.token
					}
				})
			: undefined;
	};

	$: $store, (async () => await init())();
</script>

<slot />
