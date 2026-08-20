import { type App } from '$lib/apps/registry';
import { goto } from "$app/navigation";

import Smile from "virtual:icons/fluent/emoji-smile-slight-20-regular";

export const demo: App = {
    name: "Demo",
    description: "Demo application",
    icon: Smile,
    screens: {
        "/": {
            load: () => import("$lib/apps/demo/DemoRoot.svelte")
        }
    },
    launch: () => {
        goto("/demo");
        return Promise.resolve({ success: true });
    }
}