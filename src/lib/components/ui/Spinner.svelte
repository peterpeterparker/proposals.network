<script lang="ts">
	import IconLogo from '$lib/components/icons/IconLogo.svelte';
</script>

<div class="animate-bounce">
	<IconLogo />
</div>

<style lang="scss">
	div {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
