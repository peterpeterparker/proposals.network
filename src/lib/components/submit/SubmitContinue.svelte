<script lang="ts">
import Button from "$lib/components/ui/Button.svelte";
import {wizardBusy} from "$lib/stores/busy.store";
</script>

<Button color="tertiary" disabled={$wizardBusy} on:click>
    Continue
</Button>