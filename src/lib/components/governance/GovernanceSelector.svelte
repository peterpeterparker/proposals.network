<script lang="ts">
	import Img from '$lib/components/ui/Img.svelte';
	import { governanceStore } from '$lib/derived/governance.derived';
	import IconChevronDown from '$lib/components/icons/IconChevronDown.svelte';
	import { emit } from '$lib/utils/events.utils';

	let logoSrc: string;
	$: logoSrc = $governanceStore?.logo ?? 'logo/icp.svg';

	const onSelect = () => emit({ message: 'pnwrkOpenGovernance' });
</script>

<button
	on:click={onSelect}
	class="flex justify-between items-center sm:w-96 transition-all w-full outline-none bg-white border-2 border-black h-12 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-cyan-300 focus:bg-cyan-400"
>
	<div class="p-2 pointer-events-none max-w-[48px]">
		<Img src={logoSrc} width="48px" />
	</div>

	<span class="w-full text-left">{$governanceStore?.name ?? 'Internet Computer'}</span>

	<div class="p-5 pointer-events-none">
		<IconChevronDown size="32px" />
	</div>
</button>
