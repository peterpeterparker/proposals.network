<script lang="ts">
	import { signIn } from '$lib/services/auth.services';
	import IconICMonochrome from '$lib/components/icons/IconICMonochrome.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		color?: 'secondary' | 'quaternary';
	}

	let { color = 'secondary' }: Props = $props();
</script>

<Button {color} on:click={async () => await signIn()}>
	<IconICMonochrome /> Continue with Internet Identity
</Button>
