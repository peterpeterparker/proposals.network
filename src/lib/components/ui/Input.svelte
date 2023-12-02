<script lang="ts">
	export let placeholder: string;
	export let value = '';
	export let disabled = false;
</script>

<input
	bind:value
	class="w-96 border-black border-2 p-2.5 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all"
	{placeholder}
	{disabled}
	class:opacity-20={disabled}
/>
