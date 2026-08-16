<script lang="ts">
    import { readDir, BaseDirectory, type DirEntry } from "@tauri-apps/plugin-fs";
    import { onMount } from "svelte";
    import MBList from "$lib/components/MBList.svelte";
    import Folder20Filled from "virtual:icons/fluent/folder-20-filled";
    import Document20Filled from "virtual:icons/fluent/document-20-filled";

    let entries = $state([] as DirEntry[]);

    onMount(async () => {
        entries = await readDir("", {
            baseDir: BaseDirectory.Home,
        });
    });
</script>

<main class="file-manager">
    <div>
        <MBList items={(entries.map((entry) => ({ label: entry.name, icon: entry.isDirectory ? Folder20Filled : Document20Filled, onClick: () => console.log(`Clicked on ${entry.name}`) })))}/>
    </div>
    <div>
        <MBList items={(entries.map((entry) => ({ label: entry.name, icon: entry.isDirectory ? Folder20Filled : Document20Filled, onClick: () => console.log(`Clicked on ${entry.name}`) })))}/>
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
</style>
