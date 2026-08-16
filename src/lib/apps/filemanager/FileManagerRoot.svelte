<script lang="ts">
    import { readDir, BaseDirectory, type DirEntry } from "@tauri-apps/plugin-fs";
    import { onMount } from "svelte";

    let entries = $state([] as DirEntry[]);

    onMount(async () => {
        entries = await readDir("", {
            baseDir: BaseDirectory.Home,
        });
    });
</script>

<main class="file-manager">
    <p>File Manager</p>
    <ul>
        {#each entries as entry}
            <li>{entry.name}</li>
        {/each}
    </ul>
</main>

<style>
</style>
