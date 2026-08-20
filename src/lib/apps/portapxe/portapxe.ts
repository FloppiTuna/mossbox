import NetworkToolkit from "virtual:icons/fluent/virtual-network-toolbox-20-filled";
import Cursor from "virtual:icons/fluent/cursor-20-filled";
import { goto } from "$app/navigation";
import type { App } from "$lib/apps/registry";

export const portapxe: App = {
        name: "PortaPXE",
        description: "Boot a computer over the network using iPXE. Requires an ethernet connection.",
        icon: NetworkToolkit,
        screens: {
            "/": {
                load: () => import("$lib/apps/portapxe/PortaPXERoot.svelte"),
                controls: [
                    {
                        icon: Cursor,
                        label: "Navigate"
                    }
                ]
            }
        },
        launch: () => {
            goto("/portapxe");
            return Promise.resolve({ success: true });
        }
    }