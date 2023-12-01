<script lang="ts">
	export let color: 'primary' | 'secondary' = 'primary';

	let primary: boolean;
	$: primary = color === 'primary';

	let secondary: boolean;
	$: secondary = color === 'secondary';
</script>

<button
	on:click
	class="flex items-center gap-2 border-black border-2 transition-all rounded-none h-12 px-5 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
	class:bg-cyan-200={primary}
	class:hover:bg-cyan-300={primary}
	class:active:bg-cyan-400={primary}
	class:bg-violet-200={secondary}
	class:hover:bg-violet-300={secondary}
	class:active:bg-violet-400={secondary}><slot /></button
>
