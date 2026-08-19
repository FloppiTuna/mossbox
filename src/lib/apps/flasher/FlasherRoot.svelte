<script lang="ts">
    import MBList from "$lib/components/MBList.svelte";
    import MBButton from "$lib/components/MBButton.svelte";
    import HardDrive20Filled from "virtual:icons/fluent/hard-drive-20-filled";
    import Document20Filled from "virtual:icons/fluent/document-20-filled";
    import Directory20Filled from "virtual:icons/fluent/folder-20-filled";
    import Question20Filled from "virtual:icons/fluent/question-20-filled";

    import { invoke } from "@tauri-apps/api/core";
    import { onMount } from "svelte";
    import { showDialog } from "$lib/dialog";

    let selectedImage = $state<string | null>(null);
    let selectedTarget = $state<string | null>(null);

    type FileInfo = {
        name: string;
        path: string;
        isDirectory: boolean;
        size: number | null;
    };

    type TargetInfo = {
        devnode: string;
        syspath: string;
        model: string;
        serial: string;
        vendor: string;
        size: number;
        removable: boolean;
    };

    let images = $state([] as FileInfo[]);

    let targets = $state([] as TargetInfo[]);

    const getImages = async () => {
        try {
            images = await invoke<FileInfo[]>("list_files_in_data_folder", {
                subfolder: "images",
                createIfMissing: true,
            });

            console.log("Images in data folder:", images);
        } catch (error) {
            console.error("Error listing files in data folder:", error);
        }
    };

    const getTargets = async () => {
        try {
            targets = await invoke<TargetInfo[]>("get_disks");
            console.log("Connected targets:", targets);
        } catch (error) {
            console.error("Error getting connected targets:", error);
        }
    };

    onMount(async () => {
        await getImages();
        await getTargets();
    });
</script>

<main class="flasher-root">
    <!-- images -->
    <div class="images">
        <MBList
            items={[
                ...(images.length === 0
                    ? [
                          {
                              label: "No images available",
                              description: "Add images to the 'images' folder.",
                              icon: Question20Filled,
                              inactive: true,
                          },
                      ]
                    : []),
                ...images.map((image) => ({
                    label: image.name,
                    description: image.path,
                    icon: () => {
                        // if (image.name.endsWith(".img")) {
                        //     return Document20Filled;
                        // }
                        // return HardDrive20Filled;
                        switch (true) {
                            case image.isDirectory:
                                return Directory20Filled;
                            case image.name.endsWith(".img"):
                                return HardDrive20Filled;
                            case image.name.endsWith(".iso"):
                                return Document20Filled; // todo: idfk
                            default:
                                return Document20Filled;
                        }
                    },
                    onClick: () => {
                        selectedImage = image.name;
                    },
                })),
            ]}
        />
    </div>

    <!-- targets -->
    <div class="targets">
        <MBList
            items={[
                ...(targets.length === 0
                    ? [
                          {
                              label: "No targets available",
                              description: "Please connect a target device.",
                              icon: Question20Filled,
                              inactive: true,
                          },
                      ]
                    : []),
                ...targets.map((target) => ({
                    label: target.devnode,
                    description: `${target.model} (${target.size} bytes)`,
                    icon: HardDrive20Filled,
                    onClick: () => {
                        selectedTarget = target.devnode;
                    },
                })),
            ]}
        />
    </div>

    <!-- controls -->
    <div class="controls">
        <p>
            You will flash <strong>{selectedImage}</strong> to
            <strong>{selectedTarget}</strong>.
        </p>

        <MBButton
            label="Flash Image"
            disabled={!selectedImage || !selectedTarget}
            onClick={async () => {
                if (selectedImage && selectedTarget) {
                    try {
                        await invoke("flash_image_to_device", {
                            imageName: selectedImage,
                            deviceName: selectedTarget,
                        });
                        showDialog({
                            severity: "MESSAGE",
                            title: "Flash Successful",
                            message: `Successfully flashed ${selectedImage} to ${selectedTarget}.`,
                            actions: [
                                {
                                    label: "OK",
                                    action: () => {
                                        // Do nothing, just close the dialog
                                    },
                                },
                            ],
                        });
                    } catch (error) {
                        console.error("Error flashing image:", error);
                        showDialog({
                            severity: "ERROR",
                            title: "Flash Failed",
                            message: `Failed to flash ${selectedImage} to ${selectedTarget}: ${String(error)}`,
                            actions: [
                                {
                                    label: "OK",
                                    action: () => {
                                        // Do nothing, just close the dialog
                                    },
                                },
                            ],
                        });
                    }
                }
            }}
        >
        </MBButton>
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
        padding: 1rem;
    }
</style>
