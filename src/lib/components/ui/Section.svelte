<script lang="ts">
	export let color: 'primary' | 'secondary' = 'primary';
</script>

<section
	class="w-full md:h-screen lg:h-full snap-start snap-always shrink-0 border-b-2 border-black py-24 px-4"
	class:bg-yellow-200={color === 'primary'}
	class:bg-lime-100={color === 'secondary'}
>
	<div class=" lg:mx-auto lg:max-w-screen-2xl">
		<slot />
	</div>
</section>
