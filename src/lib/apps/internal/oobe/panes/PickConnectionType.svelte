<script lang="ts">
    import MBButton from "$lib/components/MBButton.svelte";
    import { closeDialog, showDialog } from "$lib/dialog";
    import { show } from "@tauri-apps/api/app";
    import { onMount } from "svelte";

    let { changePane } = $props();

    onMount(() => {
        showDialog({
            severity: "MESSAGE",
            title: "Checking for Internet Connection",
            message: "Mossbox is checking if this device is already connected... (dev)",
        });

        // ping a known server to check for internet connectivity
        fetch("https://www.example.com", { method: "HEAD" }).finally(() => {
            // close the dialog after the check
            closeDialog();
            changePane("CHECK_HARDWARE_PANE");
        }).catch(() => {
            // if the fetch fails, assume no internet connection
            closeDialog();
        });
    });

</script>

<main class="pick-connection-type-pane">
    <h2>Pick Connection Type</h2>
    <p>Please select how you will be connecting this device to the internet.</p>

    <MBButton
        label="Wireless"
        onClick={() => changePane("WIRELESS_CONNECTION_PANE")}
    />
</main>