<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Aside from '$lib/components/ui/Aside.svelte';
	import Paginator from '$lib/components/ui/Paginator.svelte';
	import { routeProposalId } from '$lib/derived/nav.derived';
	import { goto } from '$app/navigation';
	import { GOVERNANCE_CANISTER_ID } from '$lib/constants/app.constants';
    import IconArrowOutward from "$lib/components/icons/IconArrowOutward.svelte";

	let id: number;
	$: id = Number($routeProposalId ?? '0');

	let displayPrev: boolean;
	$: displayPrev = id > 0;

	let displayNext: boolean;
	$: displayNext = id > 1;

	const prev = async () => await goto(`/proposal/?g=${GOVERNANCE_CANISTER_ID ?? ''}&id=${id + 1}`);

	const next = async () => await goto(`/proposal/?g=${GOVERNANCE_CANISTER_ID ?? ''}&id=${id - 1}`);
</script>

<Aside>
	<svelte:fragment slot="title">Take Action</svelte:fragment>

	<div class="flex flex-col">
        <div class="flex lg:flex-col gap-1">
            <Button color="quaternary" fullWidth>Share</Button>

            <a
                    href={`https://nns.ic0.app/proposal/?u=${GOVERNANCE_CANISTER_ID ?? ''}&proposal=${id}`}
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
