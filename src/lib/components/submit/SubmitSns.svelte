<script lang="ts">
	import SubmitTitle from '$lib/components/submit/SubmitTitle.svelte';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import { getContext } from 'svelte';
	import type { ProposalContent } from '$lib/types/juno';
	import SubmitWriteContent from '$lib/components/submit/SubmitWriteContent.svelte';
	import InputFile from '$lib/components/ui/InputFile.svelte';

	const { store, reload }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);

	let content: ProposalContent | undefined;

	let parameters = '';

	const init = async () => {
		parameters = $store?.metadata?.parameters ?? '';
	};
</script>

<SubmitTitle>Propose Your SNS</SubmitTitle>

<h2 class="mb-6 text-2xl">
	To propose an SNS, you need its parameters (provided in a configuration file), a logo, and a
	summary.
</h2>

<SubmitWriteContent>
	<svelte:fragment slot="before">
		<InputFile placeholder="Initial parameters (.yaml file)" />
	</svelte:fragment>
</SubmitWriteContent>
