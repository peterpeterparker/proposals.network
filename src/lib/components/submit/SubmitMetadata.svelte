<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import { getMetadata, setMetadata } from '$lib/services/idb.services';
	import { debounce, isNullish, nonNullish } from '@dfinity/utils';
	import { toasts } from '$lib/stores/toasts.store';
	import type { Doc } from '@junobuild/core';
	import type { ProposalMetadata } from '$lib/types/juno';
	import { onMount } from 'svelte';

	export let busy = false;

	let motionText = '';
	let title = '';
	let url = '';

	let docMetadata: Doc<ProposalMetadata> | undefined;

	onMount(async () => (docMetadata = await getMetadata()));

	let ready = false;
	$: ready = nonNullish(docMetadata);

	const save = async () => {
		if (motionText === '' && title === '' && url === '') {
			return;
		}

		const docMetadata = await getMetadata();

		if (isNullish(docMetadata)) {
			toasts.error({
				msg: {
					text: 'Cannot load metadata. Try to reload your window.'
				}
			});
			return;
		}

		await setMetadata({
			...docMetadata,
			data: {
				...docMetadata.data,
				...(title !== '' && { title }),
				...(url !== '' && { url }),
				...(motionText !== '' && { motionText })
			}
		});

		busy = false;
	};

	const debounceSave = debounce(save);

	$: motionText,
		title,
		url,
		(() => {
			if (motionText === '' && title === '' && url === '') {
				return;
			}

			busy = true;

			debounceSave();
		})();
</script>

<Input placeholder="The proposal title." disabled={!ready} bind:value={title} />

<Input placeholder="An URL." disabled={!ready} bind:value={url} />

<Input placeholder="Your motion text." disabled={!ready} bind:value={motionText} />
