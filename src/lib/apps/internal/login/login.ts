import Keyboard from "virtual:icons/fluent/keyboard-20-filled";
import Cursor from "virtual:icons/fluent/cursor-20-filled";
import { goto } from "$app/navigation";
import type { App } from "$lib/apps/registry";
import { getSessionContext } from "$lib/session";
import { showDialog } from "$lib/dialog";

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
        const session = getSessionContext();
        if (session?.name) {
            showDialog({
                severity: "MESSAGE",
                title: "Already Logged In",
                message:
                    `A user (${session.name}) is already logged in. Multi-user usage is not implemented. Log out to switch users.`,
                actions: [
                    {
                        label: "OK",
                        action: () => { },
                    },
                ],
            });
            return Promise.resolve({ success: false });
        } else {
            goto("/login");
            return Promise.resolve({ success: true });
        }
    }
}