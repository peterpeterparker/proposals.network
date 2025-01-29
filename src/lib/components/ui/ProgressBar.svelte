<script lang="ts">
	interface Props {
		currentValue: number;
		rounded?: 'none' | 'md' | 'full';
		color?: 'cyan' | 'violet' | 'orange' | 'red' | 'yellow' | 'lime' | 'pink';
	}

	let { currentValue = 0, rounded = 'none', color = 'lime' }: Props = $props();

	const minValue = 0;
	const maxValue = 100;
	const showPercentage = true;
	const disabled = false;

	const clampedValue = Math.min(maxValue, Math.max(currentValue, minValue));
	const widthPercentage = ((clampedValue - minValue) / (maxValue - minValue)) * 100;

	const numberFormatter = new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
</script>

<div
	class={`lg:rounded-md w-72 md:w-full max-w-md border-black border-2 focus:outline-none h-9 overflow-hidden shadow-[2px_2px_0px_rgba(0,0,0,1)] bg-white ${disabled ? 'border-[#727272] bg-[#D4D4D4] text-[#676767] hover:bg-[#D4D4D4] hover:shadow-none active:bg-[#D4D4D4]' : 'shadow-[2px_2px_0px_rgba(0,0,0,1)]'}`}
	class:rounded-none={rounded === 'none'}
	class:rounded-md={rounded === 'md'}
	class:rounded-full={rounded === 'full'}
>
	<div
		style={`width: ${widthPercentage}%`}
		class="h-full flex flex-row items-center justify-end overflow-hidden"
		class:bg-violet-200={color === 'violet' && !disabled}
		class:bg-violet-300={color === 'violet' && !disabled}
		class:bg-pink-200={color === 'pink' && !disabled}
		class:bg-pink-300={color === 'pink' && !disabled}
		class:bg-red-200={color === 'red' && !disabled}
		class:bg-red-300={color === 'red' && !disabled}
		class:bg-orange-200={color === 'orange' && !disabled}
		class:bg-orange-300={color === 'orange' && !disabled}
		class:bg-yellow-200={color === 'yellow' && !disabled}
		class:bg-yellow-300={color === 'yellow' && !disabled}
		class:bg-lime-200={color === 'lime' && !disabled}
		class:bg-lime-300={color === 'lime' && !disabled}
		class:bg-cyan-200={color === 'cyan' && !disabled}
		class:bg-cyan-300={color === 'cyan' && !disabled}
		class:rounded-none={rounded === 'none'}
		class:rounded-md={rounded === 'md'}
		class:rounded-full={rounded === 'full'}
	>
		{#if showPercentage && !disabled}
			<span
				class={`mr-2 ${widthPercentage !== 100 ? 'font-bold opacity-60' : 'font-black opacity-100'}`}
			>
				{numberFormatter.format(currentValue)}%
			</span>
		{/if}
	</div>
</div>
