<script lang="ts">
    import MBButton from "$lib/components/MBButton.svelte";

    let { changePane } = $props();
</script>

<main class="welcome-pane">
    <h2>Welcome to Mossbox!</h2>
    <p>This setup wizard will walk you through setting up this device.</p>
    <p>Use the D-pad on your uConsole to navigate the setup process. Press A to select a button.</p>
    <p>To continue, press <kbd>Next</kbd>.</p>
    <MBButton onClick={() => changePane("PICK_CONNECTION_TYPE_PANE")} label="Next" />
</main>