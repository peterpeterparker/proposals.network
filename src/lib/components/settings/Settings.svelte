<script lang="ts">
	import SplitPane from '$lib/components/ui/SplitPane.svelte';
	import UserInitializedGuard from '$lib/components/guards/UserInitializedGuard.svelte';
	import {userNotInitialized, userNotSignedIn} from '$lib/derived/user.derived';
	import SettingsSignIn from '$lib/components/settings/SettingsSignIn.svelte';
	import Title from '$lib/components/ui/Title.svelte';
	import { userStore } from '$lib/stores/user.store';
	import Copy from '$lib/components/ui/Copy.svelte';
	import IconError from "$lib/components/icons/IconError.svelte";
	import TableContainer from "$lib/components/ui/TableContainer.svelte";
	import {userProposalsStore} from "$lib/stores/user-proposals.store";
	import {loadUserProposals} from "$lib/services/loader-stores.services";
	import {governanceIdStore} from "$lib/derived/governance.derived";
	import type {Neuron} from "$lib/types/juno";
	import type {Doc} from "@junobuild/core-peer";
	import SpinnerText from "$lib/components/ui/SpinnerText.svelte";

	let neurons: Doc<Neuron>[] = [];

	const load = async () => {
		if ($userNotInitialized) {
			neurons = [];
			return;
		}

		if ($userNotSignedIn) {
			neurons = [];
			return;
		}

		await loadUserProposals({ startAfter: undefined, governanceId: $governanceIdStore });
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
				/>  on proposals.network.
			</h2>


			<SpinnerText>Hold tight, loading your neurons...</SpinnerText>

			<h2 class="mt-16 mb-6 text-4xl">Your Neurons</h2>

			<p class="leading-relaxed mb-2">
				The neurons you used for the proposals you crafted are listed below.
			</p>

			<TableContainer rows="4">
				<thead>
				<tr>
					<th>Neuron</th>
					<th>Governance</th>
					<th></th>
				</tr>
				</thead>
			</TableContainer>

			<p class="leading-relaxed text-sm mt-8 mb-4 italic">
				<IconError /> If you delete any neurons, please remember to also remove the associated hotkeys in the related neurons.
			</p>
		{/if}
	</UserInitializedGuard>
</SplitPane>
