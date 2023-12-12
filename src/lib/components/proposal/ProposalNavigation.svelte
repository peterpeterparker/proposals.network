<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Aside from '$lib/components/ui/Aside.svelte';
	import Paginator from '$lib/components/ui/Paginator.svelte';
	import { routeProposalId } from '$lib/derived/nav.derived';
	import { goto } from '$app/navigation';
	import { GOVERNANCE_CANISTER_ID } from '$lib/constants/app.constants';
	import IconArrowOutward from '$lib/components/icons/IconArrowOutward.svelte';
	import { canShare, copyText, shareText } from '$lib/utils/share.utils';
	import { toasts } from '$lib/stores/toasts.store';
	import {nonNullish} from "@dfinity/utils";
	import {rootCanisterIdStore} from "$lib/derived/sns.derived";

	let id: number;
	$: id = Number($routeProposalId ?? '0');

	let displayPrev: boolean;
	$: displayPrev = id > 0;

	let displayNext: boolean;
	$: displayNext = id > 1;

	const prev = async () => await goto(`/proposal/?g=${GOVERNANCE_CANISTER_ID ?? ''}&id=${id + 1}`);

	const next = async () => await goto(`/proposal/?g=${GOVERNANCE_CANISTER_ID ?? ''}&id=${id - 1}`);

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

	let voteUrl: string;
	$: voteUrl = `https://nns.internetcomputer.org/proposal/?proposal=${id}${nonNullish($rootCanisterIdStore) ? `&u=${$rootCanisterIdStore}` : ""}`
</script>

<Aside>
	<svelte:fragment slot="title">Take Action</svelte:fragment>

	<div class="flex flex-col">
		<div class="flex lg:flex-col gap-1">
			<Button color="quaternary" fullWidth on:click={share}>Share</Button>

			<a
				href={voteUrl}
				rel="noreferrer noopener"
				target="_blank"
			>
				<Button color="secondary" fullWidth>Vote <IconArrowOutward /></Button>
			</a>
		</div>

		<div>
			<Paginator {displayPrev} {displayNext} on:pnwrkPrevious={prev} on:pnwrkNext={next} />
		</div>
	</div>
</Aside>
