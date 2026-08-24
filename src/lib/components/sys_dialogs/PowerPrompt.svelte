<script lang="ts">
    import MBButton from "../MBButton.svelte";


</script>

<main class="power-menu">
    <MBButton
        label="Shutdown" />
    <MBButton
        label="Restart" />
    <MBButton
        label="Sleep (unsupported)" inactive />

    <MBButton
        label="Exit to Desktop" />
</main>

<style>
    .power-menu {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;

        gap: 1rem;
    }
</style>