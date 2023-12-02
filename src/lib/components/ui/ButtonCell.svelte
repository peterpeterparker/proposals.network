<script lang="ts">
	import {
		type IntersectingDetail,
		onIntersectionCell
	} from '$lib/directives/intersection.directives';

	export let disabled = false;

	let intersecting = true;
	export const onCellIntersection = ($event: Event) => {
		const {
			detail: { intersecting: i }
		} = $event as unknown as CustomEvent<IntersectingDetail>;

		intersecting = i;
	};
</script>

<button
	use:onIntersectionCell
	on:vrcIntersecting={onCellIntersection}
	tabindex={!intersecting ? -1 : 0}
	class="border-black border-2 bg-cyan-200 hover:bg-cyan-300 active:bg-cyan-400 rounded-none px-5 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] opacity-0 lg:opacity-100 min-w-max h-0 lg:h-10"
	class:opacity-20={disabled}
	on:click
	{disabled}
>
	<slot />
</button>
