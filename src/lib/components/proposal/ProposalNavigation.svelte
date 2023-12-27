<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Aside from '$lib/components/ui/Aside.svelte';
	import Paginator from '$lib/components/ui/Paginator.svelte';
	import { routeProposalId } from '$lib/derived/nav.derived';
	import IconArrowOutward from '$lib/components/icons/IconArrowOutward.svelte';
	import { canShare, copyText, shareText } from '$lib/utils/share.utils';
	import { toasts } from '$lib/stores/toasts.store';
	import { nonNullish } from '@dfinity/utils';
	import { proposalUrl } from '$lib/utils/nav.utils';
	import { goto } from '$app/navigation';
	import ProposalVoteUrl from '$lib/components/proposal/ProposalVoteUrl.svelte';
	import { governanceIdStore } from '$lib/derived/governance.derived';

	let id: number;
	$: id = Number($routeProposalId ?? '0');

	let displayPrev: boolean;
	$: displayPrev = id > 0;

	let displayNext: boolean;
	$: displayNext = id > 1;

	const prev = async () =>
		await goto(proposalUrl({ id: id + 1, governanceId: $governanceIdStore }));

	const next = async () =>
		await goto(proposalUrl({ id: id - 1, governanceId: $governanceIdStore }));

	const share = async () => {
		const url = window.location.href;

		if (canShare()) {
			await shareText(url);
			return;
		}

		await copyText(url);

		toasts.show({
			text: 'Link to proposal copied to clipboard.',
			level: 'info',
			duration: 2000
		});
	};
</script>

<Aside>
	<svelte:fragment slot="title"
		>Take Action on proposal{nonNullish($routeProposalId)
			? ` #${$routeProposalId}`
			: ''}</svelte:fragment
	>

	<div class="flex flex-col">
		<div class="flex lg:flex-col gap-1">
			<Button color="quaternary" fullWidth on:click={share}>Share</Button>

			<ProposalVoteUrl {id}>
				<Button color="secondary" fullWidth>Vote <IconArrowOutward /></Button>
			</ProposalVoteUrl>
		</div>

		<div>
			<Paginator {displayPrev} {displayNext} on:pnwrkPrevious={prev} on:pnwrkNext={next} />
		</div>
	</div>
</Aside>
