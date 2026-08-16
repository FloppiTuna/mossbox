<script lang="ts">
    import MBList from "$lib/components/MBList.svelte";
    import { onMount } from "svelte";
    import { getInterfaces, NetworkInterface } from "tauri-plugin-network-api";
    import Connected from "virtual:icons/fluent/plug-connected-20-filled";
    import Disconnected from "virtual:icons/fluent/plug-disconnected-20-filled";

    let interfaces = $state([] as NetworkInterface[]);
    onMount(async () => {
        interfaces = await getInterfaces();
    });
</script>

<main class="portapxe">
    <p>Select an interface to use.</p>
    <MBList
        items={interfaces.map((iface) => ({
            label: `${iface.name}`,
            icon: iface.v4_addrs.length > 0 || iface.v6_addrs.length > 0 ? Connected : Disconnected,
            inactive: iface.v4_addrs.length > 0 || iface.v6_addrs.length > 0,
            description: iface.v4_addrs.length > 0 || iface.v6_addrs.length > 0
                ? `This interface cannot be used because it is connected to a network: ${iface.v4_addrs.map((addr) => `${addr.ip}`).join(" | ")} | ${iface.v6_addrs.map((addr) => `${addr.ip}`).join(" | ")}`
                //? `IPv4: ${iface.v4_addrs.join(", ")} | IPv6: ${iface.v6_addrs.join(", ")}`
                : null,
            onClick: () => {
                console.log(`Selected interface: ${iface.name}`);
            },
        }))}
    />
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