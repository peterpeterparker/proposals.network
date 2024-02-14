<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';

	let title = '';
	let summary = '';
	let nodeProviderPid = '';
</script>

<h1 class="mb-12 text-4xl font-bold capitalize md:text-6xl">Register Your Node Provider Principal</h1>

<Input
    placeholder="Register a node provider 'NODE_PROVIDER_NAME'"
    bind:value={title}
    pinPlaceholder={title !== ''}
/>

<Input
    placeholder="Register a node provider 'NODE_PROVIDER_NAME', in line with the announcement and discussion at <https://forum.dfinity.org/t/...>. The self-declaration documentation is available at <https://wiki.internetcomputer.org/wiki/...> with SHA256 hash <SHA256>."
    bind:value={summary}
    pinPlaceholder={summary !== ''}
/>

<Input
    placeholder="Node Provider Principal ID"
    bind:value={nodeProviderPid}
    pinPlaceholder={nodeProviderPid !== ''}
/>

