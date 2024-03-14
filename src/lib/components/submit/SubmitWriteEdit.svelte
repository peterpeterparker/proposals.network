<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import { getEditable, setContent, setMetadata } from '$lib/services/idb.services';
	import { debounce, nonNullish } from '@dfinity/utils';
	import type { ProposalContent } from '$lib/types/juno';
	import Editor from '$lib/components/ui/Editor.svelte';
	import { METADATA_CONTEXT_KEY, type MetadataContext } from '$lib/types/metadata.context';
	import { getContext } from 'svelte';

	const { store, reload }: MetadataContext = getContext<MetadataContext>(METADATA_CONTEXT_KEY);

	let content: ProposalContent | undefined;

	let title = '';
	let url = '';
	let motionText = '';

	const init = async () => {
		title = $store?.metadata?.title ?? '';
		url = $store?.metadata?.url ?? '';
		motionText = $store?.metadata?.motionText ?? '';

		const [_, existingContent] = await getEditable();
		content = existingContent;
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

	const onUpdate = async (content: ProposalContent) => await setContent(content);
</script>

{#if nonNullish(content)}
	<Input placeholder="The proposal title" bind:value={title} pinPlaceholder={title !== ''} />

	<Editor {content} {onUpdate} />

	<Input
		placeholder="An URL (https://forum.dfinity.org...)"
		bind:value={url}
		pinPlaceholder={url !== ''}
	/>

	<Input
		placeholder="Your motion text"
		bind:value={motionText}
		pinPlaceholder={motionText !== ''}
	/>
{/if}
