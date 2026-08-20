import Cursor from "virtual:icons/fluent/cursor-20-filled";
import Rocket from "virtual:icons/fluent/rocket-20-filled";
import { goto } from "$app/navigation";
import { type App } from '$lib/apps/registry';

export const launcher: App = {
        name: "Launcher",
        description: "A launcher for apps",
        icon: Rocket,
        showInLauncher: false,
        screens: {
            "/": {
                load: () => import("$lib/apps/launcher/LauncherRoot.svelte"),
                controls: [
                    {
                        icon: Cursor,
                        label: "Navigate"
                    }
                ]
            },
            "/:folderPath": {
                load: () => import("$lib/apps/launcher/LauncherRoot.svelte"),
                controls: [
                    {
                        icon: Cursor,
                        label: "Navigate"
                    }
                ]
            }
        },
        launch: () => {
            goto("/launcher");
            return Promise.resolve({ success: true });
        }
    }