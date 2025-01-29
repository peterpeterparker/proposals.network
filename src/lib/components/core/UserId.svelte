<script lang="ts">
	import Copy from '$lib/components/ui/Copy.svelte';
	import { userStore } from '$lib/stores/user.store';
</script>

<h2 class="mb-6 text-2xl">
	Your user is identified by the principal <Copy
		value={$userStore?.key ?? ''}
		text="Principal copied."
	/> on proposals.network.
</h2>
