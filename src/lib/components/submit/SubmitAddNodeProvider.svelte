<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import { setAddNodeProviderMetadata } from '$lib/services/idb.services';
	import { debounce } from '@dfinity/utils';
	import type { AddNodeProviderEditableMetadata } from '$lib/types/juno';

	export let metadata: AddNodeProviderEditableMetadata | undefined;

	let title = '';
	let summary = '';
	let nodeProviderPid = '';

	const init = () => {
		title = metadata?.title ?? '';
		summary = metadata?.summary ?? '';
		nodeProviderPid = metadata?.nodeProviderPid ?? '';
	};

	$: metadata, init();

	const save = async () => {
		if (nodeProviderPid === '' && title === '' && summary === '') {
			return;
		}

		if (nodeProviderPid === metadata?.nodeProviderPid && title === metadata?.title && summary === metadata?.summary) {
			return;
		}

		await setAddNodeProviderMetadata({
			...(title !== '' && { title }),
			...(summary !== '' && { summary: summary }),
			...(nodeProviderPid !== '' && { nodeProviderPid: nodeProviderPid })
		});
	};

	const debounceSave = debounce(save);

	$: nodeProviderPid,
		title,
		summary,
		(() => {
			if (nodeProviderPid === '' && title === '' && summary === '') {
				return;
			}

			debounceSave();
		})();
</script>

<h1 class="mb-12 text-4xl font-bold capitalize md:text-6xl">Register Your Node Provider Principal</h1>

<Input
    placeholder="Register a node provider 'NODE_PROVIDER_NAME'"
    bind:value={title}
    pinPlaceholder={title !== ''}
/>

<Input
    placeholder="Register a node provider 'NODE_PROVIDER_NAME', in line with the announcement and discussion at <https://forum.dfinity.org/t/...>. The self-declaration documentation is available at <https://wiki.internetcomputer.org/wiki/...> with SHA256 hash <SHA256>."
    bind:value={summary}
    pinPlaceholder={summary !== ''}
/>

<Input
    placeholder="Node Provider Principal ID"
    bind:value={nodeProviderPid}
    pinPlaceholder={nodeProviderPid !== ''}
/>

