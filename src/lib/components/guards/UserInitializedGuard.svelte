<script lang="ts">
	import { userNotInitialized } from '$lib/derived/user.derived';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { blur } from 'svelte/transition';
</script>

{#if $userNotInitialized}
	<div class="h-screen">
		<Spinner />
	</div>
{:else}
	<div in:blur>
		<slot />
	</div>
{/if}
