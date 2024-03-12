<script lang="ts">
	import InputSelect from '$lib/components/ui/InputSelect.svelte';
	import type { ProposalAction } from '$lib/types/governance';
  import { setMetadata } from '$lib/services/idb.services';
	import { debounce } from '@dfinity/utils';
	import type { ProposalEditableMetadata } from '$lib/types/juno';

	export let metadata: ProposalEditableMetadata | undefined;
	export let proposalAction: ProposalAction | undefined;
  let isProposalActionSet = false;

	const init = () => {
		proposalAction = metadata?.proposalAction ?? undefined;
	};

	$: metadata, init();

	const save = async () => {
		if (proposalAction === undefined) {
			return;
		}

		if (proposalAction === metadata?.proposalAction) {
			return;
		}

		await setMetadata({
			...(proposalAction !== undefined && { proposalAction }),
		});
	};

	const debounceSave = debounce(save);

	$:	proposalAction,
		(() => {
			if (proposalAction === undefined) {
				return;
			}
      isProposalActionSet = true;
			debounceSave();
		})();

	const proposalOptions = [
		{ value: undefined, label: 'Select an option...' },
		{ value: 'Motion' as ProposalAction, label: 'Motion proposal' },
		{ value: 'AddOrRemoveNodeProvider' as ProposalAction, label: 'Add new node provider proposal' }
	];
</script>

<InputSelect bind:value={proposalAction} disabled={isProposalActionSet}>
	{#each proposalOptions as option (option.value)}
		<option disabled={option.value === undefined} value={option.value}>{option.label}</option>
	{/each}
</InputSelect>
