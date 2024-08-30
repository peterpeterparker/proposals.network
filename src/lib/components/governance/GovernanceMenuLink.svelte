<script lang="ts">
	import { emit } from '$lib/utils/events.utils';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const onClick = () => {
		dispatch('pnwrkClose');

		emit({ message: 'pnwrkOpenGovernance', detail: { navigate: true } });
	};
</script>

<button class="hover:underline hover:underline-offset-8 mb-4 text-left" on:click={onClick}
	>Submit a proposal</button
>
