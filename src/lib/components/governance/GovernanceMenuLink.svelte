<script lang="ts">
	import { emit } from '$lib/utils/events.utils';

	const onClick = () => emit({ message: 'pnwrkOpenGovernance', detail: { navigate: true } });
</script>

<button class="hover:underline hover:underline-offset-8 mb-4 text-left" on:click={onClick}
	>Submit a proposal</button
>
