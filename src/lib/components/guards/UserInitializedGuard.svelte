<script lang="ts">
	import { userNotInitialized } from '$lib/derived/user.derived';
	import { blur } from 'svelte/transition';
	import SpinnerScreen from "$lib/components/ui/SpinnerScreen.svelte";
</script>

{#if $userNotInitialized}
	<SpinnerScreen />
{:else}
	<div in:blur>
		<slot />
	</div>
{/if}
