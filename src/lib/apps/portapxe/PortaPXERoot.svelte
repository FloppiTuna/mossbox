<script lang="ts">
    import { onMount } from "svelte";
    import { getInterfaces, NetworkInterface } from "tauri-plugin-network-api";

    let interfaces = $state([] as NetworkInterface[]);
    onMount(async () => {
        interfaces = await getInterfaces();
    });
</script>

<main class="portapxe">
    {#if interfaces.length > 0}
        <p>Available network interfaces:</p>
        <ul>
            {#each interfaces as iface}
                <li>{iface.name} - {iface.mac_addr}, {JSON.stringify(iface.v4_addrs)}</li>
            {/each}
        </ul>
    {:else}
        <p>No network interfaces found.</p>
    {/if}
</main>

<style>
    .portapxe {
        padding: 1rem;
    }

    .portapxe h1 {
        font-size: 2rem;
        margin-bottom: 1rem;
    }

    .portapxe p {
        margin-bottom: 1rem;
        line-height: 1.5;
    }
</style>