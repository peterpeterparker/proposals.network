<script lang="ts">
	import InputText from '$lib/components/ui/InputText.svelte';
	import { setMetadata } from '$lib/services/idb.services';
	import { debounce } from '@dfinity/utils';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import { getContext } from 'svelte';
	import SubmitWriteContent from '$lib/components/submit/SubmitWriteContent.svelte';

	const { store, reload }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);

	let title = '';
	let url = '';
	let motionText = '';

	const init = async () => {
		title = $store?.metadata?.title ?? '';
		url = $store?.metadata?.url ?? '';
		motionText = $store?.metadata?.motionText ?? '';
	};

	$: $store, (async () => await init())();

	const save = async () => {
		if (motionText === '' && title === '' && url === '') {
			return;
		}

		if (
			motionText === $store?.metadata?.motionText &&
			title === $store?.metadata?.title &&
			url === $store?.metadata?.url
		) {
			return;
		}

		await setMetadata({
			...($store?.metadata ?? {}),
			...(title !== '' && { title }),
			...(url !== '' && { url }),
			...(motionText !== '' && { motionText })
		});

		await reload();
	};

	const debounceSave = debounce(save);

	$: motionText,
		title,
		url,
		(() => {
			if (motionText === '' && title === '' && url === '') {
				return;
			}

			debounceSave();
		})();
</script>

<SubmitWriteContent>
	<svelte:fragment slot="before">
		<InputText placeholder="The proposal title" bind:value={title} pinPlaceholder={title !== ''} />
	</svelte:fragment>

	<svelte:fragment slot="after">
		<InputText
			placeholder="An URL (https://forum.dfinity.org...)"
			bind:value={url}
			pinPlaceholder={url !== ''}
		/>

		<InputText
			placeholder="Your motion text"
			bind:value={motionText}
			pinPlaceholder={motionText !== ''}
		/>
	</svelte:fragment>
</SubmitWriteContent>
