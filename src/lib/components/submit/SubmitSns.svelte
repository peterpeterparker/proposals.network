<script lang="ts">
	import SubmitTitle from '$lib/components/submit/SubmitTitle.svelte';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import { getContext, onMount } from 'svelte';
	import SubmitWriteContent from '$lib/components/submit/SubmitWriteContent.svelte';
	import InputFile from '$lib/components/ui/InputFile.svelte';
	import { debounce, isNullish } from '@dfinity/utils';
	import { getSnsYaml, uploadSnsYaml } from '$lib/services/sns.services';
	import { routeKey } from '$lib/derived/nav.derived';
	import { userStore } from '$lib/stores/user.store';

	const { store, reload }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);

	let downloadUrl: string | undefined;
	let parametersFile: File | undefined;

	onMount(async () => {
		const { downloadUrl: url } = await getSnsYaml($routeKey);
		downloadUrl = url;
	});

	const saveYaml = async () => {
		if (isNullish(parametersFile)) {
			return;
		}

		const { downloadUrl: url } = await uploadSnsYaml({
			routeKey: $routeKey,
			file: parametersFile,
			user: $userStore
		});

		downloadUrl = url;
	};

	const debounceSaveYaml = debounce(saveYaml);

	$: parametersFile, (() => debounceSaveYaml())();
</script>

<SubmitTitle>Propose Your SNS</SubmitTitle>

<h2 class="mb-6 text-2xl">
	To propose an SNS, you need its parameters (provided in a configuration file), a logo, and a
	summary.
</h2>

<SubmitWriteContent>
	<svelte:fragment slot="before">
		<InputFile
			bind:file={parametersFile}
			{downloadUrl}
			placeholder="Initial parameters (.yaml file)"
		/>
	</svelte:fragment>
</SubmitWriteContent>
