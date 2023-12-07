<script lang="ts">
	export let color: 'primary' | 'secondary' | 'tertiary' = 'primary';
	export let wide = false;
</script>

<section
	class="w-full lg:h-full snap-start snap-always shrink-0 border-b-2 border-black"
	class:bg-yellow-200={color === 'primary'}
	class:bg-lime-100={color === 'secondary'}
	class:bg-violet-100={color === 'tertiary'}
	class:py-24={!wide}
	class:px-4={!wide}
>
	<div class=" lg:mx-auto lg:max-w-screen-2xl">
		<slot />
	</div>
</section>
