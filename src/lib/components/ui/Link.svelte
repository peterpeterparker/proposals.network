<script lang="ts">
	export let href: string;
	export let ariaLabel = '';
	export let underline: 'hover' | 'visible' = 'visible';
	export let target: '_blank' | undefined = undefined;
</script>

<a
	{href}
	rel="nofollow noopener noreferrer"
	{target}
	aria-label={ariaLabel}
	title={ariaLabel}
	class="inline-flex items-center gap-0.5 max-w-full"
	class:underline={underline === 'visible'}
	class:hover:underline={underline === 'hover'}
>
	<slot />
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
