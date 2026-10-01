import { type App } from '$lib/apps/registry';
import { goto } from "$app/navigation";
import Browser from "virtual:icons/fluent/globe-20-filled";
import Cursor from "virtual:icons/fluent/cursor-20-filled";

export const browser: App = {
        name: "Browser",
        description: "Browse the internet.",
        icon: Browser,
        screens: {
            "/": {
                load: () => import("$lib/apps/browser/BrowserRoot.svelte"),
                controls: [
                    {
                        icon: Cursor,
                        label: "Navigate"
                    }
                ]
            }
        },
        launch: () => {
            goto("/browser");
            return Promise.resolve({ success: true });
        }
    }