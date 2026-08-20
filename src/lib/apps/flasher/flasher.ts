import BoxToolbox20Filled from "virtual:icons/fluent/box-toolbox-20-filled";
import Cursor from "virtual:icons/fluent/cursor-20-filled";
import { goto } from "$app/navigation";
import type { App } from "$lib/apps/registry";


export const flasher: App = {
        name: "Flasher",
        description: "Create a bootable USB drive from an image, or create images.",
        icon: BoxToolbox20Filled,
        screens: {
            "/": {
                load: () => import("$lib/apps/flasher/FlasherRoot.svelte"),
                controls: [
                    {
                        icon: Cursor,
                        label: "Navigate"
                    }
                ]
            }
        },
        launch: () => {
            goto("/flasher");
            return Promise.resolve({ success: true });
        }
    }