<script lang="ts">
	import IconLogo from '$lib/components/icons/IconLogo.svelte';
	import IconCircleDashed from '$lib/components/icons/IconCircleDashed.svelte';
</script>

<div
	class="opacity-30 w-[50vw] aspect-square rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
>
	<IconCircleDashed />
</div>

<div
	class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70vw] aspect-square"
>
	<div class="animate-spin-medium w-full h-full">
		<div class="border-custom opacity-30 w-full h-full">
			<IconCircleDashed strokeWidth={0.45} />
		</div>
		<div class="absolute bottom-[7vw] left-[8vw]">
			<div class="animate-spin-slow hidden md:block"><IconLogo size="96px" /></div>
		</div>
		<div class="absolute bottom-[7vw] right-[7vw]">
			<div class="animate-spin-medium hidden md:block"><IconLogo size="96px" /></div>
		</div>
	</div>
</div>

<div
	class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] aspect-square"
>
	<div class="animate-spin-slow w-full h-full">
		<div class="border-custom opacity-30 w-full h-full">
			<IconCircleDashed strokeWidth={0.55} />
		</div>
		<div class="absolute top-[11vw] left-[11vw]">
			<div class="animate-spin-slow hidden md:block"><IconLogo size="96px" /></div>
		</div>
	</div>
</div>
