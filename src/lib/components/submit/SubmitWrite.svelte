<script lang="ts">
	import { getContext } from 'svelte';
	import SubmitMotion from '$lib/components/submit/motion/SubmitMotion.svelte';
	import SubmitAddNodeProvider from '$lib/components/submit/add-node-provider/SubmitAddNodeProvider.svelte';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import SubmitBusy from '$lib/components/submit/SubmitBusy.svelte';
	import SubmitSns from '$lib/components/submit/propose-sns/SubmitSns.svelte';
	import SubmitSnsTreasuryFunds from '$lib/components/submit/sns-transfer-treasury/SubmitSnsTreasuryFunds.svelte';

	const { store }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);
</script>

<SubmitBusy />

{#if $store?.metadata?.proposalAction === 'AddOrRemoveNodeProvider'}
	<SubmitAddNodeProvider on:pnwrkNext />
{:else if $store?.metadata?.proposalAction === 'CreateServiceNervousSystem'}
	<SubmitSns on:pnwrkNext />
{:else if $store?.metadata?.proposalAction === 'TransferSnsTreasuryFunds'}
	<SubmitSnsTreasuryFunds on:pnwrkNext />
{:else}
	<SubmitMotion on:pnwrkNext />
{/if}
