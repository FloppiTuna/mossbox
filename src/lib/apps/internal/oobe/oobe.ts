import Keyboard from "virtual:icons/fluent/keyboard-20-filled";
import Cursor from "virtual:icons/fluent/cursor-20-filled";
import { goto } from "$app/navigation";
import type { App } from "$lib/apps/registry";

export const oobe: App = {
        name: "Mossbox OOBE",
        description: "Initial user configuration.",
        icon: Keyboard,
        screens: {
            "/": {
                load: () => import("$lib/apps/internal/oobe/OobeRoot.svelte"),
                controls: [
                    {
                        icon: Cursor,
                        label: "Navigate"
                    }
                ]
            }
        },
        launch: () => {
            goto("/oobe");
            return Promise.resolve({ success: true });
        }
    }