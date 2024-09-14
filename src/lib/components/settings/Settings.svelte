<script lang="ts">
	import SplitPane from '$lib/components/ui/SplitPane.svelte';
	import UserInitializedGuard from '$lib/components/guards/UserInitializedGuard.svelte';
	import { userNotInitialized, userNotSignedIn } from '$lib/derived/user.derived';
	import SignInSection from '$lib/components/core/SignInSection.svelte';
	import Title from '$lib/components/ui/Title.svelte';
	import { userStore } from '$lib/stores/user.store';
	import Copy from '$lib/components/ui/Copy.svelte';
	import TableContainer from '$lib/components/ui/TableContainer.svelte';
	import { fade } from 'svelte/transition';
	import { governanceIdStore } from '$lib/derived/governance.derived';
	import { deleteNeuronId, getNeuron } from '$lib/services/neuron.services';
	import { nonNullish } from '@dfinity/utils';
	import OopsError from '$lib/components/ui/OopsError.svelte';
	import SkeletonRows from '$lib/components/ui/SkeletonRows.svelte';
	import SettingsNeuronRow from '$lib/components/settings/SettingsNeuronRow.svelte';
	import type { GovernanceCanisterId } from '$lib/types/core';
	import IconDelete from '$lib/components/icons/IconDelete.svelte';
	import type { Doc } from '@junobuild/core-peer';
	import type { Neuron } from '$lib/types/juno';
	import Aside from '$lib/components/core/Aside.svelte';

	let status: 'loading' | 'ok' | 'error' = 'loading';

	let neurons: [GovernanceCanisterId, (string | bigint)[]][] = [];
	let neuron: Doc<Neuron> | undefined;

	const reset = () => {
		neurons = [];
		status = 'ok';
	};

	const load = async () => {
		status = 'loading';

		if ($userNotInitialized) {
			reset();
			return;
		}

		if ($userNotSignedIn) {
			reset();
			return;
		}

		status = 'loading';

		const { result, neuron: n } = await getNeuron($userStore);

		status = result === 'ok' ? 'ok' : 'error';
		neurons = nonNullish(n) ? Object.entries(n.data) : [];
		neuron = n;
	};

	$: $userStore, $governanceIdStore, (async () => load())();

	const deleteNeuron = async ({ detail: neuronId }: CustomEvent<string | bigint>) => {
		const { result, neuron: updatedNeuron } = await deleteNeuronId({
			user: $userStore,
			neuron,
			neuronId: `${neuronId}`,
			governanceId: $governanceIdStore
		});

		if (result === 'error') {
			return;
		}

		neurons = nonNullish(updatedNeuron) ? Object.entries(updatedNeuron.data) : [];
		neuron = updatedNeuron;
	};
</script>

<SplitPane col="forward">
	<Aside slot="aside" />

	<UserInitializedGuard>
		{#if $userNotSignedIn}
			<SignInSection />
		{:else}
			<Title>Your Settings</Title>

			<h2 class="mb-6 text-2xl">
				Your user is identified by the principal <Copy
					value={$userStore?.key ?? ''}
					text="Principal copied."
				/> on proposals.network.
			</h2>

			{#if status === 'error'}
				<div in:fade>
					<OopsError />
				</div>
			{:else}
				<h2 class="mt-16 mb-6 text-4xl">Your Neurons</h2>

				<div class="lg:-mx-4">
					<TableContainer rows={neurons.length} actionLabel="Delete" actionIcon={IconDelete}>
						<thead>
							<tr>
								<th>Governance</th>
								<th>Neuron</th>
								<th></th>
							</tr>
						</thead>

						<tbody>
							{#if status === 'loading'}
								<SkeletonRows rows={3} columns={4} />
							{:else if neurons.length === 0}
								<tr>
									<td colspan="3">
										<span class="inline-block"
											>You have not used any neurons to craft proposals yet.</span
										>
									</td>
								</tr>
							{:else}
								{#each neurons as neuron (neuron[0])}
									<SettingsNeuronRow {neuron} on:pnwrkDelete={deleteNeuron} />
								{/each}
							{/if}
						</tbody>
					</TableContainer>
				</div>
			{/if}
		{/if}
	</UserInitializedGuard>
</SplitPane>
