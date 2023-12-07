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
	class="inline-flex items-center gap-0.5 max-w-full"
	class:underline={underline === 'visible'}
	class:hover:underline={underline === 'hover'}
>
	<span class="inline-block truncate"><slot /></span>

	<IconArrowOutward />
</a>

<style lang="scss">
	a {
		text-decoration: inherit;
		position: relative;

		&.underline:after {
			content: '';
			position: absolute;
			border-bottom: 1px solid black;
			bottom: 0;
			left: 0;
			right: 0;
		}
	}
</style>
