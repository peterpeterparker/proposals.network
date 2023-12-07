<script>
	import IconJuno from '$lib/components/icons/IconJuno.svelte';
</script>

<footer
	class="flex-col lg:flex-row w-full lg:h-[200px] m-auto flex justify-between items-center py-5 px-5 md:px-24 2xl:p-32 bg-black"
>
	<div>
		<a
			class="text-2xl font-bold text-white flex items-center gap-3 hover:underline hover:underline-offset-8"
			href="https://juno.build"
			target="_blank"
			aria-label="Built with Juno"
		>
			<IconJuno />
			Crafted with Juno
		</a>
	</div>
	<div>
		<small class="text-white"
			>by <a
				class="inline-block hover:underline hover:underline-offset-8 mb-4"
				href="https://daviddalbusco.com"
				rel="noreferrer noopener"
				target="_blank">David Dal Busco</a
			></small
		>
	</div>
</footer>
