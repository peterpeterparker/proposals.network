<script lang="ts">
	import SplitPane from '$lib/components/ui/SplitPane.svelte';
	import UserInitializedGuard from '$lib/components/guards/UserInitializedGuard.svelte';
	import { userNotInitialized, userNotSignedIn } from '$lib/derived/user.derived';
	import SettingsSignIn from '$lib/components/settings/SettingsSignIn.svelte';
	import Title from '$lib/components/ui/Title.svelte';
	import { userStore } from '$lib/stores/user.store';
	import Copy from '$lib/components/ui/Copy.svelte';
	import IconError from '$lib/components/icons/IconError.svelte';
	import TableContainer from '$lib/components/ui/TableContainer.svelte';
	import { fade } from 'svelte/transition';
	import { governanceIdStore } from '$lib/derived/governance.derived';
	import { getNeuron } from '$lib/services/neuron.services';
	import { nonNullish } from '@dfinity/utils';
	import OopsError from '$lib/components/ui/OopsError.svelte';
	import { USER_PAGINATION } from '$lib/constants/app.constants';
	import SkeletonRows from '$lib/components/ui/SkeletonRows.svelte';
	import SettingsNeuronRow from '$lib/components/settings/SettingsNeuronRow.svelte';
	import type { GovernanceCanisterId } from '$lib/types/core';
	import IconDelete from '$lib/components/icons/IconDelete.svelte';

	let status: 'loading' | 'ok' | 'error' = 'loading';

	let neurons: [GovernanceCanisterId, (string | bigint)[]][] = [];

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

		const { result, neuron } = await getNeuron($userStore);

		status = result === 'ok' ? 'ok' : 'error';
		neurons = nonNullish(neuron) ? Object.entries(neuron.data) : [];
	};

	$: $userStore, $governanceIdStore, (async () => load())();
</script>

<SplitPane col="reverse">
	<UserInitializedGuard>
		{#if $userNotSignedIn}
			<SettingsSignIn />
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
								<SkeletonRows rows={USER_PAGINATION} columns={3} />
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
									<SettingsNeuronRow {neuron} />
								{/each}
							{/if}
						</tbody>
					</TableContainer>
				</div>

				<p class="leading-relaxed text-sm mt-8 mb-4 italic">
					<IconError /> If you delete any neurons, please remember to also remove the associated hotkeys
					in the related neurons.
				</p>
			{/if}
		{/if}
	</UserInitializedGuard>
</SplitPane>
