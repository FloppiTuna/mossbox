<script lang="ts">
    let { changePane } = $props();

</script>

<main class="finish-pane">
    <h2>Welcome to Mossbox</h2>
    <p>Press Finish to reboot and complete the setup.</p>

    <button onclick={() => {
        //...reboot the device
    }}>Finish</button>
</main>

<style>
    .finish-pane {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
    }
</style>