<script lang="ts">
    import MBProgressBar from "$lib/components/MBProgressBar.svelte";
    import { onMount } from "svelte";

    let { changePane } = $props();

    let progress = $state(0);

    onMount(() => {
        const interval = setInterval(() => {
            progress += 1;
            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 500);
    });
</script>

<main class="check-hardware-pane">
    <h2>Checking Hardware...</h2>
    <p>Mossbox is currently scanning the hardware attached to your uConsole to determine what needs to be installed.</p>

    <MBProgressBar progress={progress} />
    <button onclick={() => changePane("NETWORK_PANE")}>Next</button>
</main>