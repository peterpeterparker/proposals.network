<script lang="ts">
	import { userNotInitialized } from '$lib/derived/user.derived';
	import Spinner from '$lib/components/ui/Spinner.svelte';
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
