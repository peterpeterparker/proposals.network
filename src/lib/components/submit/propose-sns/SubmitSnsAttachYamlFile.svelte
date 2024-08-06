<script lang="ts">
	import InputFile from '$lib/components/ui/InputFile.svelte';
	import { debounce, isNullish } from '@dfinity/utils';
	import { mapSnsYaml, uploadSnsFile } from '$lib/services/submit.sns.services';
	import { userStore } from '$lib/stores/user.store';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import { getContext } from 'svelte';
	import SubmitSnsFile from '$lib/components/submit/propose-sns/SubmitSnsFile.svelte';
	import { setMetadata } from '$lib/services/idb.services';

	const { store, reload }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);

	let downloadUrl: string | undefined;
	let file: File | undefined;

	const collection = 'sns-parameters';
	const extension = 'yaml';

	const save = async () => {
		if (isNullish(file)) {
			return;
		}

		const { result, yaml } = await mapSnsYaml(file);

		if (result === 'error' || isNullish(yaml)) {
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

		await setMetadata({
			...($store?.metadata ?? {}),
			title: `NNS Proposal to create an SNS named '${yaml.name}'`
		});

		await reload();
	};

	const debounceSave = debounce(save);

	$: file, (() => debounceSave())();
</script>

<SubmitSnsFile {extension} {collection} bind:downloadUrl>
	<InputFile
		bind:file
		{downloadUrl}
		placeholder="Initial parameters (Yaml file)"
		accept=".yml,.yaml"
	/>
</SubmitSnsFile>
