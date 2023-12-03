<script lang="ts">
	import IconArrowOutward from '$lib/components/icons/IconArrowOutward.svelte';

	export let href: string;
	export let ariaLabel = '';
</script>

<a
	{href}
	rel="nofollow noopener noreferrer"
	target="_blank"
	aria-label={ariaLabel}
	title={ariaLabel}
	class="inline-flex items-center gap-0.5 underline underline-offset-8"
>
	<slot />

	<IconArrowOutward />
</a>
