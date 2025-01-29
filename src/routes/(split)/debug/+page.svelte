<script lang="ts">
	import Section from '$lib/components/ui/Section.svelte';
	import SplitPane from '$lib/components/ui/SplitPane.svelte';
	import Aside from '$lib/components/core/Aside.svelte';
	import UserInitializedGuard from '$lib/components/guards/UserInitializedGuard.svelte';
	import SignInSection from '$lib/components/core/SignInSection.svelte';
	import Title from '$lib/components/ui/Title.svelte';
	import { userNotSignedIn } from '$lib/derived/user.derived';
	import InputText from '$lib/components/ui/InputText.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { isBusy } from '$lib/derived/busy.derived';
	import { assertNonNullish, isEmptyString } from '@dfinity/utils';
	import { toasts } from '$lib/stores/toasts.store';
	import UserId from '$lib/components/core/UserId.svelte';
	import { busy } from '$lib/stores/busy.store';
	import { GOVERNANCE_CANISTER_ID } from '$lib/constants/app.constants';
	import { getAgent } from '$lib/api/agent.api';
	import { unsafeIdentity } from '@junobuild/core';
	import { GovernanceCanister, Vote } from '@dfinity/nns';
	import { Principal } from '@dfinity/principal';

	let neuronId = $state('');
	let proposalIds = $state('');

	const onsubmit = async ($event: SubmitEvent) => {
		$event.preventDefault();

		if (isEmptyString(neuronId)) {
			toasts.error({
				msg: { text: 'Please provide a valid NNS neuron ID linked with an hotkey.' }
			});
			return;
		}

		const proposals = proposalIds.split(',');

		if (proposals.length < 1) {
			toasts.error({
				msg: { text: 'Please provide a list of proposals.' }
			});
			return;
		}

		busy.start();

		try {
			assertNonNullish(GOVERNANCE_CANISTER_ID, 'The ICP governance canister ID is not set.');

			const agent = await getAgent({ identity: await unsafeIdentity() });

			const { registerVote } = GovernanceCanister.create({
				agent,
				canisterId: Principal.fromText(GOVERNANCE_CANISTER_ID)
			});

			for (const proposalId of proposalIds) {
				await registerVote({
					neuronId: BigInt(neuronId),
					proposalId: BigInt(proposalId),
					vote: Vote.No
				});
			}

			toasts.show({
				text: 'Votes casted.',
				level: 'info',
				duration: 2000
			});
		} catch (err: unknown) {
			toasts.error({
				msg: { text: 'Unexpected error while voting for the proposals.' },
				err
			});
		}

		busy.stop();
	};
</script>

<Section wide>
	<SplitPane col="forward">
		<Aside slot="aside" cta={false} />

		<UserInitializedGuard>
			{#if $userNotSignedIn}
				<SignInSection />
			{:else}
				<form {onsubmit}>
					<Title>Debug</Title>

					<UserId />

					<InputText
						placeholder="Your Neuron ID (NNS)"
						bind:value={neuronId}
						pinPlaceholder={neuronId !== ''}
					/>

					<InputText
						placeholder="Proposal IDs (comma separated)"
						bind:value={proposalIds}
						pinPlaceholder={proposalIds !== ''}
					/>

					<h3 class="bg-black border-2 border-black text-white text-center p-2 my-8 lg:rounded">
						⚠️ Please be absolutely sure before continuing ⚠️
					</h3>

					<Button type="submit" color="tertiary" disabled={$isBusy}>Vote NO</Button>
				</form>
			{/if}
		</UserInitializedGuard>
	</SplitPane>
</Section>
