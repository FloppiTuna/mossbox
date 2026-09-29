<script lang="ts">
    import MBProgressBar from "$lib/components/MBProgressBar.svelte";
    import { onMount } from "svelte";

    let { changePane } = $props();

    let progress = $state(0);

    onMount(() => {
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 10) + 5; // Increment progress by a random value between 5 and 15
            if (progress >= 100) {
                clearInterval(interval);
                changePane("MAKE_USER_PANE")
            }
        }, 100);
    });
</script>

<main class="check-hardware-pane">
    <h2>Checking Hardware...</h2>
    <p>Mossbox is currently scanning the hardware attached to your uConsole to determine what needs to be installed.</p>

    <MBProgressBar progress={progress} />
    <!-- <button onclick={() => changePane("NETWORK_PANE")}>Next</button> -->
</main>