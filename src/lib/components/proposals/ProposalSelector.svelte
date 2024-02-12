<script lang="ts">
    import InputSelect from '$lib/components/ui/InputSelect.svelte';

    // These types correspond with IC Proposal Documentation (https://wiki.internetcomputer.org/wiki/Network_Nervous_System#Proposals)
    type ProposalType = 'Motion' | 'AddOrRemoveNodeProvider';

    export let proposalType: ProposalType | undefined;

    const proposalOptions = [
        { value: undefined, label: 'Select an option...' }, 
        { value: 'Motion' as ProposalType, label: 'Motion proposal' },
        { value: 'AddOrRemoveNodeProvider' as ProposalType, label: 'Add new node provider proposal' },
    ];
</script>

<InputSelect bind:value={proposalType}>
    {#each proposalOptions as option (option.value)}
        <option value={option.value}>{option.label}</option>
    {/each}
</InputSelect>
