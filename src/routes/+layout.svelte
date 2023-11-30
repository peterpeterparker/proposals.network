<script lang="ts">
	import Juno from '$lib/components/core/Juno.svelte';
	import Busy from "$lib/components/ui/Busy.svelte";
	import Toasts from "$lib/components/ui/Toasts.svelte";
</script>

<Juno>
	<slot />
</Juno>

<Busy />
<Toasts />