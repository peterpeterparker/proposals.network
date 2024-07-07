<script lang="ts">
	import SubmitTitle from '$lib/components/submit/SubmitTitle.svelte';
	import SubmitWriteContent from '$lib/components/submit/SubmitWriteContent.svelte';
	import SubmitSnsAttachFile from '$lib/components/submit/SubmitSnsAttachFile.svelte';
	import { mapSnsYaml } from '$lib/services/submit.sns.services';
</script>

<SubmitTitle>Propose Your SNS</SubmitTitle>

<h2 class="mb-6 text-2xl">
	To propose an SNS, you need its parameters (provided in a configuration file), a logo, and a
	summary.
</h2>

<SubmitWriteContent>
	<svelte:fragment slot="before">
		<SubmitSnsAttachFile
			placeholder="Initial parameters (Yaml file)"
			extension="yaml"
			collection="sns-parameters"
			assert={mapSnsYaml}
			accept=".yml,.yaml"
		/>

		<SubmitSnsAttachFile
			placeholder="Logo of the Dao and Token"
			extension="png"
			collection="sns-logo"
			assert={async () => ({ result: 'ok' })}
			accept="image/png"
			linkTarget="_blank"
		/>
	</svelte:fragment>
</SubmitWriteContent>
