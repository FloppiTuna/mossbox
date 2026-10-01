import Keyboard from "virtual:icons/fluent/keyboard-20-filled";
import Cursor from "virtual:icons/fluent/cursor-20-filled";
import { goto } from "$app/navigation";
import type { App } from "$lib/apps/registry";
import { getSessionContext } from "$lib/session";

export const login: App = {
        name: "Login",
        description: "Log in.",
        icon: Keyboard,
        screens: {
            "/": {
                load: () => import("$lib/apps/internal/login/LoginRoot.svelte"),
                controls: [
                    {
                        icon: Cursor,
                        label: "Navigate"
                    }
                ]
            }
        },
        launch: () => {
            goto("/login");
            return Promise.resolve({ success: true });
        }
    }