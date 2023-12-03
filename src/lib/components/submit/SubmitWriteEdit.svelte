<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import { setContent, setMetadata } from '$lib/services/idb.services';
	import { debounce, nonNullish } from '@dfinity/utils';
	import type { ProposalEditableMetadata } from '$lib/types/juno';
	import { onMount } from 'svelte';
	import type { ProposalContent } from '$lib/types/juno';
	import Editor from '$lib/components/ui/Editor.svelte';

	export let metadata: ProposalEditableMetadata | undefined;
	export let content: ProposalContent | undefined;

	let title = '';
	let url = '';
	let motionText = '';

	const init = () => {
		title = metadata?.title ?? '';
		url = metadata?.url ?? '';
		motionText = metadata?.motionText ?? '';
	};

	$: metadata, init();

	const save = async () => {
		if (motionText === '' && title === '' && url === '') {
			return;
		}

		if (motionText === metadata?.motionText && title === metadata?.title && url === metadata?.url) {
			return;
		}

		await setMetadata({
			...(title !== '' && { title }),
			...(url !== '' && { url }),
			...(motionText !== '' && { motionText })
		});
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
	<Input placeholder="The proposal title." bind:value={title} pinPlaceholder={title !== ''} />

	<Editor {content} {onUpdate} />

	<Input placeholder="An URL." bind:value={url} pinPlaceholder={url !== ''} />

	<Input
		placeholder="Your motion text."
		bind:value={motionText}
		pinPlaceholder={motionText !== ''}
	/>
{/if}
