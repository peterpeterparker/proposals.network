<script lang="ts">
	import { nonNullish } from '@dfinity/utils';

	export let src: string;
	export let alt = '';
	export let role = 'presentation';
	export let loading: 'eager' | 'lazy' = 'lazy';
	export let width: string | undefined = undefined;
	export let height: string | undefined = undefined;
	export let styleClass: string | undefined = undefined;
</script>

<img
	{src}
	{role}
	{alt}
	{loading}
	{width}
	{height}
	decoding="async"
	on:load
	class={nonNullish(styleClass) ? styleClass : ''}
/>
