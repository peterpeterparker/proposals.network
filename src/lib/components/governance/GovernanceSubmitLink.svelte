<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { emit } from '$lib/utils/events.utils';

	export let color: 'primary' | 'secondary' | 'tertiary' | 'quaternary' = 'primary';

	const onClick = () => emit({ message: 'pnwrkOpenGovernance', detail: { navigate: true } });
</script>

<Button {color} on:click={onClick}>Submit a proposal</Button>
