<script lang="ts">
	import InputFile from '$lib/components/ui/InputFile.svelte';
	import { debounce, isNullish } from '@dfinity/utils';
	import { getDownloadUrl, uploadSnsFile } from '$lib/services/sns.services';
	import { userStore } from '$lib/stores/user.store';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import { getContext } from 'svelte';

	export let placeholder: string;
	export let collection: string;
	export let extension: 'yaml' | 'png';
	export let accept: string;
	export let assert: (file: File) => Promise<{ result: 'ok' | 'error' }>;
	export let linkTarget: '_blank' | undefined = undefined;

	const { store }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);

	let downloadUrl: string | undefined;
	let file: File | undefined;

	const mount = async () => {
		if (isNullish($store?.key)) {
			return;
		}

		const { downloadUrl: url } = await getDownloadUrl({
			key: $store.key,
			collection,
			extension
		});

		downloadUrl = url;
	};

	$: $store, (async () => await mount())();

	const save = async () => {
		if (isNullish(file)) {
			return;
		}

		const { downloadUrl: url } = await uploadSnsFile({
			key: $store?.key,
			file: file,
			user: $userStore,
			assert,
			extension,
			collection
		});

		downloadUrl = url;
	};

	const debounceSaveYaml = debounce(save);

	$: file, (() => debounceSaveYaml())();
</script>

<InputFile bind:file {downloadUrl} {placeholder} {accept} {linkTarget} />
