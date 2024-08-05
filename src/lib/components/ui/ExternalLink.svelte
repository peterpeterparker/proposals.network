<script lang="ts">
	import IconArrowOutward from '$lib/components/icons/IconArrowOutward.svelte';
	import Link from '$lib/components/ui/Link.svelte';

	export let href: string;
	export let ariaLabel = '';
	export let underline: 'hover' | 'visible' = 'visible';
</script>

<Link target="_blank" {href} {ariaLabel} {underline}>
	<span class="inline-block truncate"><slot /></span>

	<IconArrowOutward />
</Link>
