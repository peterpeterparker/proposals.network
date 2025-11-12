<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import IconGoogle from '$lib/components/icons/IconGoogle.svelte';
	import { signIn } from '@junobuild/core';

	interface Props {
		color?: 'secondary' | 'quaternary';
	}

	let { color = 'secondary' }: Props = $props();

	const login = async () => {
		await signIn({
			google: {
				options: {
					redirect: {
						redirectUrl: `${window.location.origin}/auth/callback/google`
					}
				}
			}
		});
	};
</script>

<Button {color} on:click={login}>
	<IconGoogle /> Continue with Google
</Button>
