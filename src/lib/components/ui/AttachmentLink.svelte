<script lang="ts">
	import Link from '$lib/components/ui/Link.svelte';
	import IconAttach from '$lib/components/icons/IconAttach.svelte';

	export let href: string;
	export let ariaLabel = '';
</script>

<Link {href} {ariaLabel} underline="hover">
	<IconAttach />

	<span class="inline-block truncate"><slot /></span>
</Link>
