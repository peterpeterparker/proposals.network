<script lang="ts">
	import Container from '$lib/components/ui/Container.svelte';
	import HtmlMarkdown from '$lib/components/ui/HtmlMarkdown.svelte';
	import type { ProposalContent } from '$lib/types/juno';
	import AttachmentLink from '$lib/components/ui/AttachmentLink.svelte';
	import SubmitSnsFile from '$lib/components/submit/SubmitSnsFile.svelte';

	export let content: ProposalContent | undefined;

	let downloadUrlYaml: string | undefined;
	let downloadUrlLogo: string | undefined;
</script>

<SubmitSnsFile extension="yaml" collection="sns-parameters" bind:downloadUrl={downloadUrlYaml}>
	<Container>
		<aside slot="title">Initial parameters</aside>
		<article class="p-2.5">
			<AttachmentLink href={downloadUrlYaml ?? ''}>File attached.</AttachmentLink>
		</article>
	</Container>
</SubmitSnsFile>

<SubmitSnsFile extension="png" collection="sns-logo" bind:downloadUrl={downloadUrlLogo}>
	<Container>
		<aside slot="title">Logo of the Dao and Token</aside>
		<article class="p-2.5">
			<AttachmentLink href={downloadUrlLogo ?? ''} target="_blank">File attached.</AttachmentLink>
		</article>
	</Container>
</SubmitSnsFile>

<HtmlMarkdown {content} />
