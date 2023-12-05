<div class="flex flex-col lg:flex-row min-h-screen">
	<aside
		class="flex justify-center lg:block lg:bg-cyan-200 lg:fixed lg:top-20 lg:left-0 lg:w-[300px] lg:h-screen lg:overflow-y-scroll lg:px-16 pt-36 lg:pt-16 lg:border-r-2 lg:border-black"
	>
		<slot name="aside" />
	</aside>

	<div
		class="w-full lg:w-[calc(100%-300px)] lg:ml-[300px] px-4 lg:px-16 pt-9 lg:pt-36 pb-36 h-full"
	>
		<slot />
	</div>
</div>
