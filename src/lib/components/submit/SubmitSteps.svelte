<script lang="ts">
    import Step from "$lib/components/ui/Step.svelte";
</script>

<aside class="hidden lg:block bg-cyan-200 fixed top-20 left-0 w-[300px] h-screen overflow-y-scroll px-16 py-16 border-r-2 border-black">
    <label class="text-lg font-bold block mb-4">Submit a proposal</label>

    <ul class="flex flex-col gap-1 pb-16">
        <Step active>
            <svelte:fragment slot="step">1</svelte:fragment>
            Sign-in
        </Step>

        <Step>
            <svelte:fragment slot="step">2</svelte:fragment>
            Compose
        </Step>

        <Step>
            <svelte:fragment slot="step">3</svelte:fragment>
            Hotkey
        </Step>

        <Step>
            <svelte:fragment slot="step">4</svelte:fragment>
            Review
        </Step>

        <Step>
            <svelte:fragment slot="step">5</svelte:fragment>
            Submit
        </Step>
    </ul>
</aside>
