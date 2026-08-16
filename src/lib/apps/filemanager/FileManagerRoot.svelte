<script lang="ts">
    import {
        readDir,
        BaseDirectory,
        type DirEntry,
    } from "@tauri-apps/plugin-fs";
    import { onMount } from "svelte";
    import MBList from "$lib/components/MBList.svelte";
    import Folder20Filled from "virtual:icons/fluent/folder-20-filled";
    import Document20Filled from "virtual:icons/fluent/document-20-filled";

    let entriesLeft = $state([] as DirEntry[]);
    let entriesRight = $state([] as DirEntry[]);
    let currentPathLeft = $state("");
    let currentPathRight = $state("");

    onMount(async () => {
        entriesLeft = await readDir("", {
            baseDir: BaseDirectory.Home,
        });

        entriesRight = await readDir("", {
            baseDir: BaseDirectory.Home,
        });
    });

    async function navigateToDirectory(entry: DirEntry, side: "left" | "right") {
        if (!entry.isDirectory) return;

        const currentPath = side === "left" ? currentPathLeft : currentPathRight;

        const newPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;

        const entries = await readDir(newPath, {
            baseDir: BaseDirectory.Home,
        });

        if (side === "left") {
            entriesLeft = entries;
            currentPathLeft = newPath;
        } else {
            entriesRight = entries;
            currentPathRight = newPath;
        }
    }
</script>

<main class="file-manager">
    <div>
        <div class="path">
            ~/{currentPathLeft}
        </div>

        <MBList
            items={entriesLeft.map((entry) => ({
                label: entry.name,
                icon: entry.isDirectory ? Folder20Filled : Document20Filled,
                onClick: () => navigateToDirectory(entry, "left"),
            }))}
        />
    </div>

    <div>
        <div class="path">
            ~/{currentPathRight}
        </div>

        <MBList
            items={entriesRight.map((entry) => ({
                label: entry.name,
                icon: entry.isDirectory ? Folder20Filled : Document20Filled,
                onClick: () => navigateToDirectory(entry, "right"),
            }))}
        />
    </div>
</main>

<style>
    .file-manager {
        display: flex;
        flex-direction: row;
        height: 100%;
        width: 100%;
        gap: 1rem;
    }

    .file-manager > div {
        flex: 1;
    }

    .file-manager .path {
        font-weight: bold;
        margin-bottom: 0.5rem;
    }
</style>
