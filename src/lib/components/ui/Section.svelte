<script lang="ts">
    export let styleClass: string;
</script>

<section
	class={`${styleClass} w-full md:h-screen lg:h-full snap-start snap-always shrink-0 border-b-2 border-black py-24 px-4`}
>
	<div class=" lg:mx-auto lg:max-w-screen-2xl">
		<slot />
	</div>
</section>
