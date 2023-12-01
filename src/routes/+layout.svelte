<script lang="ts">
	import Juno from '$lib/components/core/Juno.svelte';
	import Busy from '$lib/components/ui/Busy.svelte';
	import Toasts from '$lib/components/ui/Toasts.svelte';
	import Worker from "$lib/components/core/Worker.svelte";
</script>

<Juno>
	<Worker>
		<slot />
	</Worker>
</Juno>

<Busy />
<Toasts />
