<script lang="ts">
	export let disabled = false;
	export let active = false;
</script>

<button
	type="button"
	class="px-2 border-2 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
	class:bg-cyan-300={active}
	class:active:bg-cyan-200={active}
	class:border-black={active}
	class:border-transparent={!active}
	class:hover:border-black={!active}
	class:shadow-[2px_2px_0px_rgba(0,0,0,1)]={active}
	class:hover:bg-violet-400={!active}
	class:active:bg-violet-200={!active}
	class:opacity-10={disabled}
	{disabled}
	on:click><slot /></button
>
