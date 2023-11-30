<script lang="ts">
	export let active = false;
</script>

<li class="inline-flex gap-2 items-center mb-4">
	<span
		class="w-8 h-8 inline-flex items-center justify-center border-2 rounded-full border-black"
		class:bg-white={active}
		class:shadow-[2px_2px_0px_rgba(0,0,0,1)]={active}><slot name="step" /></span
	>

	<span class="hidden sm:inline-block"><slot /></span>
</li>
