<script lang="ts">
	export let col: 'reverse' | 'forward' = 'forward';
</script>

<div
	class="flex lg:flex-row min-h-screen"
	class:flex-col={col === 'forward'}
	class:flex-col-reverse={col === 'reverse'}
>
	<aside
		class="flex justify-center lg:block lg:bg-cyan-200 lg:fixed lg:top-20 lg:left-0 lg:w-[300px] lg:h-screen lg:overflow-y-scroll lg:px-16 lg:pt-16 lg:border-r-2 lg:border-black"
		class:pt-36={col === 'forward'}
		class:pb-16={col === 'reverse'}
	>
		<slot name="aside" />
	</aside>

	<div
		class="w-full lg:w-[calc(100%-300px)] lg:ml-[300px] px-4 lg:px-16 lg:pt-32 h-full"
		class:pt-12={col === 'forward'}
		class:pt-32={col === 'reverse'}
		class:pb-32={col === 'forward'}
		class:lg:pb-32={col === 'reverse'}
	>
		<slot />
	</div>
</div>
