<script lang="ts">
	export let color: 'primary' | 'secondary' | 'tertiary' = 'primary';

	let primary: boolean;
	$: primary = color === 'primary';

	let secondary: boolean;
	$: secondary = color === 'secondary';

	let tertiary: boolean;
	$: tertiary = color === 'tertiary';
</script>

<div
	class="bg-white border-2 border-black lg:rounded-md overflow-hidden h-full mb-16 md:mb-0 lg:mb-16 xl:mb-0"
>
	<aside
		class="border-b-2 border-black p-2"
		class:bg-cyan-200={primary}
		class:bg-violet-200={secondary}
		class:bg-lime-200={tertiary}
	>
		<slot name="title" />
	</aside>

	<slot />
</div>
