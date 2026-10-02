<script lang="ts">
    import { LogicalPosition, LogicalSize } from "@tauri-apps/api/dpi";
    import { getCurrentWindow } from "@tauri-apps/api/window";
    import { Webview } from "@tauri-apps/api/webview";
    import { onMount } from "svelte";

    let browserFrame: HTMLIFrameElement | null = null;

    onMount(() => {
        if (browserFrame) {
            // set iframe src
            (browserFrame as HTMLIFrameElement).src = "https://www.example.com"; // Replace with your desired URL
        }
    });
</script>

<main class="browser-root">
    <iframe bind:this={browserFrame} title="Browser" class="browser-root" style="width: 100%; height: 100%; border: none;"></iframe>
</main>
    
<style>
    .browser-root {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>
