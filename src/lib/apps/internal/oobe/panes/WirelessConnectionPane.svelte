<script lang="ts">
    import MBList from "$lib/components/MBList.svelte";
    import { closeDialog, showDialog } from "$lib/dialog";
    import { invoke } from "@tauri-apps/api/core";
    import { onMount } from "svelte";

    let { changePane } = $props();

    type Network = {
        ssid: string;
        needsPassword: boolean;
    }

    let networks = $state<Network[]>([]);

    async function attemptConnection(network: Network) {
        // Simulate attempting to connect to the network
        showDialog({
            severity: "MESSAGE",
            title: "Connecting",
            message: `Attempting to connect to ${network.ssid}...`,
        });

        setTimeout(() => {
            closeDialog();
        }, 2000);
    }


    async function fetchNetworks() {
        await invoke("scan_wireless_networks")
            .then((result: any) => {
                networks = result as Network[];
            })
            .catch((error: any) => {
                console.error("Error fetching networks:", error);
                showDialog({
                    severity: "ERROR",
                    title: "Error",
                    message: "Failed to fetch wireless networks. Please try again.",
                    actions: [
                        {
                            label: "Retry",
                            action: () => {
                                closeDialog();
                                fetchNetworks();
                            },
                        },
                    ],
                });
            });
    }

    onMount(async () => {
        await fetchNetworks();
    });


</script>

<main class="wireless-connection-pane">
    <h2>Wireless Connection</h2>
    <p>Please select the wireless network you would like to connect to.</p>

    <MBList
        items={networks.map(network => ({
            label: network.ssid,
            onClick: () => attemptConnection(network),
        }))}
    />
</main>