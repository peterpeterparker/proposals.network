<script lang="ts">
	import InputSelect from '$lib/components/ui/InputSelect.svelte';

    let proposalType;
</script>

<InputSelect bind:value={proposalType}>
    <div slot="placeholder">Select an option...</div>
    <option value="option1">Motion proposal</option>
    <option value="option2">Add new node provider proposal</option>
</InputSelect>
