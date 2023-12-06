<script lang="ts">
	import IconArrowOutward from '$lib/components/icons/IconArrowOutward.svelte';

	export let href: string;
	export let ariaLabel = '';
	export let underline: 'hover' | 'visible' = 'visible';
</script>

<a
	{href}
	rel="nofollow noopener noreferrer"
	target="_blank"
	aria-label={ariaLabel}
	title={ariaLabel}
	class="inline-flex items-center gap-0.5 underline-offset-8 truncate"
	class:underline={underline === 'visible'}
	class:hover:underline={underline === 'hover'}
>
	<slot />

	<IconArrowOutward />
</a>
