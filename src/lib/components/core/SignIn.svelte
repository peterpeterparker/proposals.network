<script lang="ts">
	import SignInWithGoogle from '$lib/components/core/SignInWithGoogle.svelte';
	import SignInWithII from '$lib/components/core/SignInWithII.svelte';

	interface Props {
		color?: 'secondary' | 'quaternary';
	}

	let props: Props = $props();
</script>

<div class="inline-flex flex-col gap-2">
	<SignInWithGoogle {...props} />
	<SignInWithII {...props} />
</div>
