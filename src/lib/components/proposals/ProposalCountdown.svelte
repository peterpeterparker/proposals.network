<script lang="ts">
	import type { Option } from '@dfinity/nns';
	import { isNullish, nonNullish, secondsToDuration } from '@dfinity/utils';
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	export let deadlineTimestampSeconds: Option<bigint>;

	let countdown: bigint | undefined = undefined;

	export const nowInSeconds = (): number => Math.round(Date.now() / 1000);

	let timer: number | undefined;

	const fn = () => {
		if (isNullish(deadlineTimestampSeconds)) {
			clear();
			return;
		}

		countdown = deadlineTimestampSeconds - BigInt(nowInSeconds());
	};

	const clear = () => {
		if (isNullish(timer)) {
			return;
		}

		clearInterval(timer);
	};

	onMount(() => {
		fn();
		timer = setInterval(fn, 1000);
	});
	onDestroy(clear);
</script>

{#if nonNullish(countdown)}
	<span class="block" in:fade>{secondsToDuration({ seconds: countdown })}</span>
{/if}
