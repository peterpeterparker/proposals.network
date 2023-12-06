<script lang="ts">
	export let color: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary' = 'primary';

	let primary: boolean;
	$: primary = color === 'primary';

	let secondary: boolean;
	$: secondary = color === 'secondary';

	let tertiary: boolean;
	$: tertiary = color === 'tertiary';

	let quaternary: boolean;
	$: quaternary = color === 'quaternary';

	let quinary: boolean;
	$: quinary = color === 'quinary';
</script>

<div
	class="tiptap w-full focus:outline-none bg-white border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] lg:rounded-md overflow-hidden mb-8 h-full"
>
	<aside
		class="flex flex-wrap gap-2 items-center border-b-2 border-black p-2"
		class:bg-cyan-200={secondary}
		class:bg-violet-200={primary}
		class:bg-lime-200={tertiary}
		class:bg-pink-200={quaternary}
		class:bg-red-200={quinary}
	>
		<slot name="title" />
	</aside>

	<slot />
</div>
