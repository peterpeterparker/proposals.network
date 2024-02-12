<script lang="ts">
	import SubmitSteps from '$lib/components/submit/SubmitSteps.svelte';
	import UserInitializedGuard from '$lib/components/guards/UserInitializedGuard.svelte';
	import { userNotSignedIn } from '$lib/derived/user.derived';
	import SubmitSignIn from '$lib/components/submit/SubmitSignIn.svelte';
	import SubmitWrite from '$lib/components/submit/SubmitWrite.svelte';
	import SubmitSelect from '$lib/components/submit/SubmitSelect.svelte';
	import { routeKey } from '$lib/derived/nav.derived';
	import { userStore } from '$lib/stores/user.store';
	import { initUserProposal } from '$lib/services/submit.services';
	import { goto } from '$app/navigation';
	import { confirmToCloseBrowser } from '$lib/utils/before-unload.utils';
	import SubmitNeuron from '$lib/components/submit/SubmitNeuron.svelte';
	import SubmitReview from '$lib/components/submit/SubmitReview.svelte';
	import { isWizardBusy } from '$lib/derived/busy.derived';
	import SubmitDone from '$lib/components/submit/SubmitDone.svelte';
	import SubmitReadonly from '$lib/components/submit/SubmitReadonly.svelte';
	import SplitPane from '$lib/components/ui/SplitPane.svelte';
	import type { Doc } from '@junobuild/core-peer';
	import type { Neuron } from '$lib/types/juno';
	import { firstNeuronId } from '$lib/utils/juno.utils';
	import { governanceIdStore } from '$lib/derived/governance.derived';
    import ProposalType from '$lib/components/proposals/ProposalSelector.svelte';



	let step: undefined | 'select' | 'write' | 'neuron' | 'review' | 'submitted' | 'readonly' = undefined;
	let neuronId: string | undefined;
	let proposalType: ProposalType | undefined;
	let proposalId: bigint | undefined;

	const init = async () => {
		const { result } = await initUserProposal({ user: $userStore, routeKey: $routeKey });

		if (result === 'error') {
			await goto('/', { replaceState: true });
			return;
		}

		if (result === 'not_allowed') {
			step = undefined;
			return;
		}

		if (result === 'readonly') {
			step = 'readonly';
			return;
		}

		step = 'select';
	};

	$: $userStore, $routeKey, (async () => await init())();

	$: confirmToCloseBrowser($isWizardBusy);

	const done = ({ detail }: CustomEvent<bigint | undefined>) => {
		proposalId = detail;
		step = 'submitted';
	};

	const review = ({ detail: neuron }: CustomEvent<Doc<Neuron> | undefined>) => {
		neuronId = firstNeuronId({ neuron, governanceId: $governanceIdStore });
		step = 'review';
	};
</script>

<SplitPane>
	<svelte:fragment slot="aside">
		<SubmitSteps {step} />
	</svelte:fragment>

	<UserInitializedGuard>
		{#if $userNotSignedIn}
			<SubmitSignIn />
		{:else if step === 'select'}
			<SubmitSelect bind:proposalType on:pnwrkNext={() => (step = 'write')} />
		{:else if step === 'write'}
			<SubmitWrite {proposalType} on:pnwrkNext={() => (step = 'neuron')} />
		{:else if step === 'neuron'}
			<SubmitNeuron on:pnwrkNext={review} on:pnwrkReview={() => (step = 'review')} bind:neuronId />
		{:else if step === 'review'}
			<SubmitReview
				{neuronId}
				on:pnwrkNext={() => (step = 'submitted')}
				on:pnwrkEdit={() => (step = 'write')}
				on:pnwrkDone={done}
			/>
		{:else if step === 'submitted'}
			<SubmitDone {proposalId} />
		{:else if step === 'readonly'}
			<SubmitReadonly />
		{/if}
	</UserInitializedGuard>
</SplitPane>
