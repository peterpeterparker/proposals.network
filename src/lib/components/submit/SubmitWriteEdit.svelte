<script lang="ts">
	import InputText from '$lib/components/ui/InputText.svelte';
	import { getEditable, setContent, setMetadata } from '$lib/services/idb.services';
	import { debounce, nonNullish } from '@dfinity/utils';
	import type { ProposalContent } from '$lib/types/juno';
	import Editor from '$lib/components/ui/Editor.svelte';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import { getContext } from 'svelte';

	const { store, reload }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);

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
	<InputText placeholder="The proposal title" bind:value={title} pinPlaceholder={title !== ''} />

	<Editor {content} {onUpdate} />

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
{/if}
