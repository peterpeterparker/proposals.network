<script lang="ts">
    import InputSelect from '$lib/components/ui/InputSelect.svelte';

    export let proposalType: string | undefined;

    const proposalOptions = [
        { value: undefined, label: 'Select an option...' }, 
        { value: 'option1', label: 'Motion proposal' },
        { value: 'option2', label: 'Add new node provider proposal' },
    ];
</script>

<InputSelect bind:value={proposalType}>
    {#each proposalOptions as option (option.value)}
        <option value={option.value}>{option.label}</option>
    {/each}
</InputSelect>

