<script lang="ts">
	import Link from '$lib/components/ui/Link.svelte';
	import IconAttach from '$lib/components/icons/IconAttach.svelte';

	export let href: string;
	export let ariaLabel = '';
	export let target: '_blank' | undefined = undefined;
</script>

<Link {href} {ariaLabel} {target} underline="hover">
	<IconAttach />

	<span class="inline-block truncate"><slot /></span>
</Link>
