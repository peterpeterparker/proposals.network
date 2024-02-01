<script lang="ts">
    import InputSelect from '$lib/components/ui/InputSelect.svelte';

    export let proposalType: string | undefined;

    const proposalOptions = [
        { value: 'option1', label: 'Motion proposal' },
        { value: 'option2', label: 'Add new node provider proposal' },
    ];

</script>

<InputSelect bind:value={proposalType}>
    <div slot="placeholder">Select an option...</div>
    {#each proposalOptions as option (option.value)}
        <option value={option.value}>{option.label}</option>
    {/each}
</InputSelect>
