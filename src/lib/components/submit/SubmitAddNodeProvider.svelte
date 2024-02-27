<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import { setMetadata } from '$lib/services/idb.services';
	import { debounce } from '@dfinity/utils';
	import type { ProposalEditableMetadata } from '$lib/types/juno';

	export let metadata: ProposalEditableMetadata | undefined;

	// TODO: make the fields more fine grained and then construct the proposal according to a template behind the scenes

	let title = '';
	let summary = '';
	let nodeProviderId = '';

	const init = () => {
		title = metadata?.title ?? '';
		summary = metadata?.summary ?? '';
		nodeProviderId = metadata?.nodeProviderId ?? '';
	};

	$: metadata, init();

	const save = async () => {
		if (nodeProviderId === '' && title === '' && summary === '') {
			return;
		}

		if (
			nodeProviderId === metadata?.nodeProviderId &&
			title === metadata?.title &&
			summary === metadata?.summary
		) {
			return;
		}

		await setMetadata({
			...(title !== '' && { title }),
			...(summary !== '' && { summary }),
			...(nodeProviderId !== '' && { nodeProviderId })
		});
	};

	const debounceSave = debounce(save);

	$: nodeProviderId,
		title,
		summary,
		(() => {
			if (nodeProviderId === '' && title === '' && summary === '') {
				return;
			}

			debounceSave();
		})();
</script>

<h1 class="mb-12 text-4xl font-bold capitalize md:text-6xl">
	Register Your Node Provider Principal
</h1>

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
	bind:value={nodeProviderId}
	pinPlaceholder={nodeProviderId !== ''}
/>
