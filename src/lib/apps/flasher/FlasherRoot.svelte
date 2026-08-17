<script lang="ts">
    import MBList from "$lib/components/MBList.svelte";
    import HardDrive20Filled from "virtual:icons/fluent/hard-drive-20-filled";
    import Document20Filled from "virtual:icons/fluent/document-20-filled";
    import { invoke } from "@tauri-apps/api/core";

    let selectedImage = $state<string | null>(null);
    let selectedTarget = $state<string | null>(null);

    // temp
    const images = [
        {
            name: "ubuntu-22.04-desktop-amd64.iso",
            description: "Ubuntu 22.04 Desktop ISO",
            size: 3.5 * 1024 * 1024 * 1024, // 3.5 GB
        }
    ]

    const targets = [
        {
            name: "SanDisk Ultra 32GB",
            description: "USB Flash Drive at /dev/sdb",
            size: 32 * 1024 * 1024 * 1024, // 32 GB
        }
    ]

    const getDisks = async () => {
        try {
            const disks = await invoke("get_disks");
            console.log("Disks:", disks);
        } catch (error) {
            console.error("Error getting disks:", error);
        }
    };

    getDisks();

</script>

<main class="flasher-root">
    <!-- images -->
    <div class="images">
        <MBList
            items={(images.map((image) => ({
                label: image.name,
                description: image.description,
                icon: Document20Filled,
                onClick: () => {
                    selectedImage = image.name;
                },
            })))}
        />
    </div>

    <!-- targets -->
    <div class="targets">
        <MBList
            items={(targets.map((target) => ({
                label: target.name,
                description: target.description,
                icon: HardDrive20Filled,
                onClick: () => {
                    selectedTarget = target.name;
                },
            })))}
        />
    </div>

    <!-- controls -->
    <div class="controls">
        <p>Selected Image: {selectedImage}</p>
        <p>Selected Target: {selectedTarget}</p>
    </div>
</main>

<style>
    .flasher-root {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr;
        flex-direction: row;
        height: 100%;
        width: 100%;
        gap: 1.2rem;
    }

    .flasher-root .images {
        flex: 1 1 0;
        min-width: 0;
        background: #000000;
        box-sizing: border-box;
    }

    .flasher-root .targets {
        flex: 1 1 0;
        min-width: 0;
        background: #000000;
        box-sizing: border-box;
    }

    .flasher-root .controls {
        flex: 1 1 0;
        min-width: 0;
        background: #000000;
        box-sizing: border-box;
    }
</style>
