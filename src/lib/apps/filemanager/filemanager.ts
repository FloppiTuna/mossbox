import { goto } from "$app/navigation";
import Cursor from "virtual:icons/fluent/cursor-20-filled";
import type { App } from "$lib/apps/registry";

export const filemanager: App = {
        name: "File Manager",
        description: "A file manager for browsing files",
        icon: Cursor,
        screens: {
            "/": {
                load: () => import("$lib/apps/filemanager/FileManagerRoot.svelte"),
                controls: [
                    {
                        icon: Cursor,
                        label: "Navigate"
                    }
                ]
            }
        },
        launch: () => {
            goto("/filemanager");
            return Promise.resolve({ success: true });
        }
    }