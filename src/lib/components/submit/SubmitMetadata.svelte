<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import { getMetadata, setMetadata } from '$lib/services/idb.services';
	import { debounce, isNullish, nonNullish } from '@dfinity/utils';
	import { toasts } from '$lib/stores/toasts.store';
	import type { Doc } from '@junobuild/core';
	import type { ProposalMetadata } from '$lib/types/juno';
	import { wizardBusy } from '$lib/stores/busy.store';

	export let busy = false;

	let title = '';
	let url = '';
	let motionText = '';

	let docMetadata: Doc<ProposalMetadata> | undefined;

	let ready = false;

	const init = async () => {
		docMetadata = await getMetadata();

		title = docMetadata?.data.title ?? '';
		url = docMetadata?.data.url ?? '';
		motionText = docMetadata?.data.motionText ?? '';

		ready = true;
	};

	$: $wizardBusy,
		(async () => {
			if (ready) {
				return;
			}

			await init();
		})();

	const save = async () => {
		if (motionText === '' && title === '' && url === '') {
			return;
		}

		if (
			!ready ||
			(motionText === (docMetadata?.data.motionText ?? '') &&
				title === (docMetadata?.data.title ?? '') &&
				url === (docMetadata?.data.url ?? ''))
		) {
			return;
		}

		// Reload last timestamp
		docMetadata = await getMetadata();

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

<Input
	placeholder="The proposal title."
	disabled={!ready}
	bind:value={title}
	pinPlaceholder={title !== ''}
/>

<Input placeholder="An URL." disabled={!ready} bind:value={url} pinPlaceholder={url !== ''} />

<Input
	placeholder="Your motion text."
	disabled={!ready}
	bind:value={motionText}
	pinPlaceholder={motionText !== ''}
/>
