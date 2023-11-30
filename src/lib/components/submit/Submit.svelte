<script lang="ts">
	import Editor from '$lib/components/ui/Editor.svelte';
	import SubmitSteps from "$lib/components/submit/SubmitSteps.svelte";

	let step: 'sign-in' | 'compose' | 'hotkey' | 'submit' = 'sign-in';
</script>

<div class="flex flex-col lg:flex-row">
	<SubmitSteps />

	<div class="bg-yellow-200 w-full lg:w-[calc(100vw-300px)] lg:ml-[300px] px-4 lg:px-16 pt-16 lg:pt-36 pb-36 h-full">
		<Editor />
	</div>
</div>
