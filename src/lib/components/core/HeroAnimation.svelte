<script lang="ts">
	import IconLogo from '$lib/components/icons/IconLogo.svelte';
</script>

<div
	class="border-2 border-black opacity-10 w-[50vw] aspect-square rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
></div>

<div
	class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70vw] aspect-square"
>
	<div class="animate-spin-slow w-full h-full">
		<div class="border-2 border-black opacity-20 rounded-full w-full h-full"></div>
		<div class="absolute bottom-[7vw] right-[7vw]"><IconLogo size="96px" /></div>
	</div>
</div>

<div
	class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] aspect-square"
>
	<div class="animate-spin-slow w-full h-full">
		<div class="border-2 border-black opacity-30 rounded-full w-full h-full"></div>
		<div class="absolute top-[10vw] left-[10vw]"><IconLogo size="96px" /></div>
	</div>
</div>
