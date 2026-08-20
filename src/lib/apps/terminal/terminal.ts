import { type App } from '$lib/apps/registry';
import { goto } from "$app/navigation";
import Terminal from "virtual:icons/fluent/window-console-20-filled";
import Keyboard from "virtual:icons/fluent/keyboard-20-filled";


export const terminal: App = {
        name: "Terminal",
        description: "A terminal emulator",
        icon: Terminal,
        screens: {
            "/": {
                load: () => import("$lib/apps/terminal/TerminalRoot.svelte"),
                controls: [
                    {
                        icon: Keyboard,
                        label: "Type"
                    }
                ]
            }
        },
        launch: () => {
            goto("/terminal");
            return Promise.resolve({ success: true });
        }
    }