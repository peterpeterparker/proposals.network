<script lang="ts">
	import { isHash, stringifyJson, isPrincipal } from '$lib/utils/json.utils';
	import { handleKeyPress } from '$lib/utils/keyboard.utils';
	import { nonNullish } from '@dfinity/utils';
	import {sanitize} from "$lib/utils/html.utils";

	export let json: unknown | undefined = undefined;
	export let defaultExpandedLevel = Infinity;
	export let _key = '';
	export let _level = 1;
	export let _collapsed: boolean | undefined = undefined;

	type ValueType =
		| 'bigint'
		| 'boolean'
		| 'function'
		| 'null'
		| 'number'
		| 'object'
		| 'principal'
		| 'hash'
		| 'string'
		| 'symbol'
		| 'base64Encoding'
		| 'undefined';

	const getValueType = (value: unknown): ValueType => {
		if (value === null) return 'null';
		if (isPrincipal(value)) return 'principal';
		if (Array.isArray(json) && isHash(json)) return 'hash';
		if (
			nonNullish(value) &&
			typeof value === 'object' &&
			!Array.isArray(value) &&
			Object.keys(value as object)[0] === 'base64Encoding'
		)
			return 'base64Encoding';

		return typeof value;
	};

	let valueType: ValueType;
	let value: unknown;
	let keyLabel: string;
	let children: [string, unknown][];
	let hasChildren: boolean;
	let isExpandable: boolean;
	let isArray: boolean;
	let openBracket: string;
	let closeBracket: string;
	let root: boolean;
	let testId: 'json' | undefined;
	$: {
		valueType = getValueType(json);
		isExpandable = valueType === 'object';
		value = isExpandable ? json : stringifyJson(json);
		keyLabel = `${_key}${_key.length > 0 ? ': ' : ''}`;
		children = isExpandable ? Object.entries(json as object) : [];
		hasChildren = children.length > 0;
		isArray = Array.isArray(json);
		openBracket = isArray ? '[' : '{';
		closeBracket = isArray ? ']' : '}';
		root = _level === 1;
		testId = root ? 'json' : undefined;
	}

	let title: string | undefined;
	$: title = valueType === 'hash' ? (json as number[]).join() : undefined;

	let collapsed = true;
	$: collapsed = _collapsed === undefined ? defaultExpandedLevel < _level : _collapsed;

	const toggle = () => (collapsed = !collapsed);
</script>

{#if isExpandable && hasChildren}
	{#if collapsed}
		<span
			data-tid={testId}
			class="key"
			class:expanded={!collapsed}
			class:collapsed
			class:root
			class:arrow={isExpandable && hasChildren}
			role="button"
			aria-label="Toggle"
			tabindex="0"
			on:keypress={($event) => handleKeyPress({ $event, callback: toggle })}
			on:click|stopPropagation={toggle}
			>{keyLabel}
			<span class="bracket">{openBracket} ... {closeBracket}</span>
		</span>
	{:else}
		<!-- key -->
		<span
			data-tid={testId}
			class="key"
			class:expanded={!collapsed}
			class:collapsed
			class:root
			class:arrow={isExpandable && hasChildren}
			role="button"
			aria-label="Toggle"
			tabindex="0"
			on:keypress={($event) => handleKeyPress({ $event, callback: toggle })}
			on:click|stopPropagation={toggle}
			>{keyLabel}<span class="bracket open">{openBracket}</span></span
		>
		<!-- children -->
		<ul>
			{#each children as [key, value]}
				<li class="pl-2">
					<svelte:self json={value} _key={key} {defaultExpandedLevel} _level={_level + 1} />
				</li>
			{/each}
		</ul>
		<span class="bracket close">{closeBracket}</span>
	{/if}
{:else if isExpandable}
	<!-- no childre -->
	<span data-tid={testId} class="key" class:root
		>{keyLabel}<span class="bracket">{openBracket} {closeBracket}</span></span
	>
{:else}
	<!-- key:value -->
	<span data-tid={testId} class="key-value">
		{#if valueType === 'base64Encoding'}
			{@const src = sanitize(JSON.parse(value).base64Encoding)}

			<span class="key" class:root>{keyLabel}</span><span class="value {valueType}" {title}>
				<img {src} loading="lazy" alt={title} class="max-w-[24px] inline-block align-bottom" />
			</span>
		{:else}
			<span class="key" class:root>{keyLabel}</span><span class="value {valueType}" {title}
				>{value}</span
			>{/if}</span
	>
{/if}

<style lang="postcss">
	.root,
	.root ~ ul,
	.root ~ span {
		/* first arrow extra space */
		@apply pl-2;
		@apply ml-4;
	}

	ul {
		/* reset */
		margin: 0;
		@apply pr-4;
		list-style: none;

		@apply flex;
		@apply flex-col;
		@apply gap-1;
	}

	.key {
		display: inline-block;
		position: relative;

		color: var(--label-color);

		@apply mr-1;
		@apply font-semibold;
	}

	.arrow {
		/* increase click area */
		@apply py-1;
		/* compensate click area */
		transform: translateX(calc(-1 * 0.125rem));
		min-width: 0.5rem;

		display: inline-block;
		position: relative;
		@apply rounded-sm;

		&:hover {
			@apply text-pink-200;

			&::before {
				@apply text-pink-200;
			}
		}

		&::before {
			display: inline-block;
			position: absolute;
			left: 0;
			top: 0;
			/* Move left to compensate for the padding of the ul */
			/* Move down to componsate for the gap between li */
			transform: translate(-1rem, calc(0.8 * 0.25rem));
		}
		&.expanded::before {
			content: '▼';
		}
		&.collapsed::before {
			content: '▶';
		}
	}

	.value {
		/* Values can be strings of JSON and long. We want to break the value, so that the keys stay on the same line. */
		word-break: break-all;
		@apply rounded-sm;
	}

	/* value types */
	.bracket {
		&:hover {
			@apply bg-gray-400;
		}
	}

	.value {
		&:hover {
			@apply bg-violet-200;
		}
	}

	.value.string {
		&:hover {
			@apply bg-pink-200;
		}
	}

	.value.number {
		&:hover {
			@apply bg-lime-200;
		}
	}
	.value.null {
		&:hover {
			@apply bg-gray-600;
		}
	}

	.value.principal {
		&:hover {
			@apply bg-red-200;
		}
	}

	.value.hash {
		&:hover {
			@apply bg-cyan-200;
		}
	}

	.value.bigint {
		&:hover {
			@apply bg-lime-200;
		}
	}

	.value.boolean {
		&:hover {
			@apply bg-violet-200;
		}
	}
</style>
