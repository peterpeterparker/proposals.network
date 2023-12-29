<script lang="ts">
	import { signIn } from '$lib/services/auth.services';
	import IconICMonochrome from '$lib/components/icons/IconICMonochrome.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Popover from '$lib/components/ui/Popover.svelte';
	import IconNFID from '$lib/components/icons/IconNFID.svelte';
	import IconIC from '$lib/components/icons/IconIC.svelte';

	export let color: 'secondary' | 'quaternary' = 'secondary';

	let visible = false;
	let button: HTMLButtonElement | undefined;
</script>

<Button {color} on:click={async () => await signIn()}>
	<IconICMonochrome /> Continue with Internet Identity
</Button>

<button class="my-4 mx-5 text-xs" bind:this={button} on:click={() => (visible = true)}
	>More sign-in options.</button
>

<Popover bind:visible anchor={button}>
	<button class="flex gap-2 pb-4 text-sm items-center" on:click={async () => await signIn()}>
		<IconIC /> Identity on internetcomputer.org
	</button>

	<button
		class="flex gap-2 pb-4 text-sm items-center"
		on:click={async () => await signIn('ic0.app')}
	>
		<IconIC /> Identity on ic0.app
	</button>

	<button aria-label="Sign-in with NFID" on:click={async () => await signIn('nfid')}>
		<IconNFID />
	</button>
</Popover>
