<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { submitUrl } from '$lib/utils/nav.utils';
	import { governanceIdStore } from '$lib/derived/governance.derived';
</script>

<a href={submitUrl({ governanceId: $governanceIdStore })}><Button>Submit a proposal</Button> </a>
