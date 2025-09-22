<script lang="ts">
	import InputFile from '$lib/components/ui/InputFile.svelte';
	import { debounce, isNullish } from '@dfinity/utils';
	import { uploadSnsFile } from '$lib/services/submit.sns.services';
	import { userStore } from '$lib/stores/user.store';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import { getContext } from 'svelte';
	import type { StorageSnsCollections } from '$lib/types/juno';
	import SubmitSnsFile from '$lib/components/submit/propose-sns/SubmitSnsFile.svelte';

	export let placeholder: string;
	export let collection: StorageSnsCollections;
	export let extension: 'yaml' | 'png';
	export let accept: string;
	export let linkTarget: '_blank' | undefined = undefined;

	const { store }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);

	let downloadUrl: string | undefined;
	let file: File | undefined;

	const save = async () => {
		if (isNullish(file)) {
			return;
		}

		const { downloadUrl: url } = await uploadSnsFile({
			key: $store?.key,
			file: file,
			user: $userStore,
			extension,
			collection
		});

		downloadUrl = url;
	};

	const debounceSaveYaml = debounce(save);

	$: (file, (() => debounceSaveYaml())());
</script>

<SubmitSnsFile {extension} {collection} bind:downloadUrl>
	<InputFile bind:file {downloadUrl} {placeholder} {accept} {linkTarget} />
</SubmitSnsFile>
