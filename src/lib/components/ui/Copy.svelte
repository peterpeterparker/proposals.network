<script lang="ts">
	import IconCopy from '$lib/components/icons/IconCopy.svelte';
	import { copyText } from '$lib/utils/share.utils';
	import { toasts } from '$lib/stores/toasts.store';
	import { shortenWithMiddleEllipsis } from '$lib/utils/format.utils';
	import { userStore } from '$lib/stores/user.store';
	import Button from "$lib/components/ui/Button.svelte";

	export let value: string;
	export let text: string;

	const copyToClipboard = async () => {
		await copyText(value);

		toasts.show({
			text,
			level: 'info',
			duration: 2000
		});
	};
</script>

<button
	on:click|preventDefault|stopPropagation={copyToClipboard}
	aria-label={`Copy: ${value}`}
	class="inline-flex items-center py-0.5 px-2 bg-lime-200 hover:bg-lime-300 active:bg-lime-400 border-2 border-black hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
>
	<output class="break-words mr-1">{shortenWithMiddleEllipsis($userStore.owner ?? '')}</output>
	<IconCopy />
</button>
