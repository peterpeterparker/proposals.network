<script lang="ts">
	import { blur } from 'svelte/transition';
	import SubmitSnsTreasuryFundsParams from '$lib/components/submit/sns-transfer-treasury/SubmitSnsTreasuryFundsParams.svelte';
	import SubmitSnsTreasuryFundsContent from '$lib/components/submit/sns-transfer-treasury/SubmitSnsTreasuryFundsContent.svelte';

	let step: 'params' | 'draft' = 'params';
</script>

{#if step === 'params'}
	<div in:blur>
		<SubmitSnsTreasuryFundsParams on:pnwrkNext={() => (step = 'draft')} />

		<p class="leading-relaxed text-sm mt-8 mb-4 italic">
			For now, only transfer in <strong>ICP</strong> are supported. Pull requests on the
			<a
				href="https://github.com/peterpeterparker/proposals.network"
				target="_blank"
				class="underline underline-offset-2"
				rel="noopener noreferrer nofollow">GitHub repository</a
			> most welcomed.
		</p>
	</div>
{:else if step === 'draft'}
	<div in:blur>
		<SubmitSnsTreasuryFundsContent on:pnwrkNext on:pnwrkBack={() => (step = 'params')} />
	</div>
{/if}
