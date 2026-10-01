<script lang="ts">
    import { getCurrentWindow } from "@tauri-apps/api/window";
    import { Webview } from "@tauri-apps/api/webview";
    import { onMount } from "svelte";

    onMount(() => {
        let disposed = false;

        const setupWebview = async () => {
            const existingWebview = await Webview.getByLabel("browser");
            if (disposed) return;

            if (existingWebview) {
                await existingWebview.show();
                return;
            }

            const webview = new Webview(getCurrentWindow(), "browser", {
                url: "https://homestuck.com/",
                x: 0,
                y: 0,
                width: 800,
                height: 600,
            });

            await new Promise<void>((resolve, reject) => {
                void webview.once("tauri://created", () => resolve());
                void webview.once("tauri://error", (event) => reject(event.payload));
            });

            if (!disposed) await webview.show();
        };

        void setupWebview().catch((error) => {
            console.error("Failed to create browser webview:", error);
        });

        return () => {
            disposed = true;
        };
    });
</script>

<main class="browser-root"></main>
    
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
