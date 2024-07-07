<script lang="ts">
	import SubmitTitle from '$lib/components/submit/SubmitTitle.svelte';
	import SubmitWriteContent from '$lib/components/submit/SubmitWriteContent.svelte';
	import SubmitSnsAttach from '$lib/components/submit/SubmitSnsAttach.svelte';
	import { assertSnsYaml } from '$lib/services/sns.services';
</script>

<SubmitTitle>Propose Your SNS</SubmitTitle>

<h2 class="mb-6 text-2xl">
	To propose an SNS, you need its parameters (provided in a configuration file), a logo, and a
	summary.
</h2>

<SubmitWriteContent>
	<svelte:fragment slot="before">
		<SubmitSnsAttach
			placeholder="Initial parameters (.yaml file)"
			extension="yaml"
			collection="sns-yaml"
			assert={assertSnsYaml}
			accept=".yml,.yaml"
		/>

		<SubmitSnsAttach
			placeholder="Dao and Token Logo"
			extension="png"
			collection="sns-logo"
			assert={async () => ({ result: 'ok' })}
			accept="image/png"
			linkTarget="_blank"
		/>
	</svelte:fragment>
</SubmitWriteContent>
