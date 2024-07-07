<script lang="ts">
	import SubmitTitle from '$lib/components/submit/SubmitTitle.svelte';
	import SubmitWriteContent from '$lib/components/submit/SubmitWriteContent.svelte';
	import SubmitSnsAttachYamlFile from '$lib/components/submit/SubmitSnsAttachYamlFile.svelte';
	import SubmitSnsAttachLogoFile from '$lib/components/submit/SubmitSnsAttachLogoFile.svelte';
</script>

<SubmitTitle>Propose Your SNS</SubmitTitle>

<h2 class="mb-6 text-2xl">
	To propose an SNS, you need its parameters (provided in a configuration file), a logo, and a
	summary.
</h2>

<SubmitWriteContent>
	<svelte:fragment slot="before">
		<SubmitSnsAttachYamlFile />

		<SubmitSnsAttachLogoFile />
	</svelte:fragment>
</SubmitWriteContent>
