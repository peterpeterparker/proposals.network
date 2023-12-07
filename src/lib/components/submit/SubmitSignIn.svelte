<script>
	import Button from '$lib/components/ui/Button.svelte';
	import IconICMonochrome from '$lib/components/icons/IconICMonochrome.svelte';
	import { signIn } from '$lib/services/auth.services';
</script>

<h1 class="font-bold capitalize text-4xl md:text-6xl mb-12">Getting Started</h1>

<h2 class="text-2xl mb-6">
	Let's face it, command line tools sucks! But fear not, I've got you covered. Submit motion
	proposals for the Internet Computer's network nervous system using this user-friendly editor.
</h2>

<p class="leading-relaxed mb-4">
	Sign in to get started. I know it might seem like a hassle, but trust me, it's necessary. It
	ensures your drafts to be saved securely and, it is not possible to submit a proposal anonymously
	anyway.
</p>

<Button color="secondary" on:click={signIn}>
	<IconICMonochrome /> Continue with Internet Identity
</Button>
