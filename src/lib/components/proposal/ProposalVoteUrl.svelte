<script lang="ts">
	import { nonNullish } from '@dfinity/utils';
	import { rootCanisterIdStore } from '$lib/derived/sns.derived';

	export let id: number | bigint;

	let voteUrl: string;
	$: voteUrl = `https://nns.internetcomputer.org/proposal/?proposal=${id}${
		nonNullish($rootCanisterIdStore) ? `&u=${$rootCanisterIdStore}` : ''
	}`;
</script>

<a href={voteUrl} rel="noreferrer noopener" target="_blank">
	<slot />
</a>
