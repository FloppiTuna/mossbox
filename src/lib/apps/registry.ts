import { goto } from "$app/navigation";
import type { Component } from "svelte";
import Terminal from "virtual:icons/fluent/window-console-20-filled";
import Keyboard from "virtual:icons/fluent/keyboard-20-filled";
import Cursor from "virtual:icons/fluent/cursor-20-filled";
import Smile from "virtual:icons/fluent/emoji-smile-slight-20-regular";
import Rocket from "virtual:icons/fluent/rocket-20-filled";
import NetworkToolkit from "virtual:icons/fluent/virtual-network-toolbox-20-filled";
import BrokenHeart from "virtual:icons/fluent/heart-broken-20-filled";
import BoxToolbox20Filled from "virtual:icons/fluent/box-toolbox-20-filled";

export type Control = {
    icon: Component;
    label: string;
}

export type AppScreen = {
    load: () => Promise<any>;
    controls?: Control[];
}

export type App = {
    // The display name of the app.
    name: string;
    // The description of the app.
    description: string;
    // The icon of the app. This can be a path to an image file or a Svelte component.
    icon?: Component;
    // The screens this app has, and their respective components.
    // NOTE: Your app must have a root ("/") screen, and all other screens must be reachable from the root screen.
    screens: Record<string, AppScreen>;
    // Whether or not this application should appear in the app launcher.
    // If false, the app will not be listed in the app launcher, but can still be launched via URL.
    showInLauncher?: boolean;
    // The launch function of this app. The return value of this function will determine what happens next probably.
    launch: () => Promise<LaunchAppResult>;
};

export type Folder = {
    id: string;
    name: string;
    description?: string;
    icon?: Component;

    // IDs of apps and folders contained by this folder.
    children: RegistryEntry[];
};

export type RegistryEntry =
    | {
        type: "app";
        id: string;
    }
    | {
        type: "folder";
        id: string;
    };


export type LaunchAppResult = {
    success: boolean;
    error?: string;
};

export type ResolvedRegistryEntry =
    | {
        type: "app";
        app: App;
    }
    | {
        type: "folder";
        folder: Folder;
    };

export type ResolveAppScreenResult =
    | {
        success: true;
        app: App;
        appId: string;
        screenPath: string;
        loadScreen: () => Promise<any>;
        controls?: Control[];
    }
    | {
        success: false;
        error: string;
    };

function normalizeScreenPath(rawPath: string | undefined): string {
    if (!rawPath) {
        return "/";
    }

    const segments = rawPath
        .split("/")
        .map((segment) => segment.trim())
        .filter(Boolean);

    return segments.length === 0 ? "/" : `/${segments.join("/")}`;
}

export const appRegistry: Record<string, App> = {
    demo: {
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
    },
    terminal: {
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
    },
    launcher: {
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
    },
    filemanager: {
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
    },

    flasher: {
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
    },

    portapxe: {
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
};

export const folderRegistry: Record<string, Folder> = {
    root: {
        id: "root",
        name: "Root",
        description: "You've been here the whole time!",
        children: [
            { type: "folder", id: "rescue" },
            { type: "folder", id: "accessories" },
            { type: "folder", id: "utilities" }
        ]
    },
    rescue: {
        id: "rescue",
        name: "Rescue",
        description: "Tools to rescue computers that are unable to boot, or are missing an operating system.",
        icon: BrokenHeart,
        children: [
            { type: "app", id: "flasher" },
            { type: "app", id: "portapxe" }
        ]
    },
    accessories: {
        id: "accessories",
        name: "Accessories",
        icon: Smile,
        description: "Have some fun!",
        children: [
            { type: "app", id: "demo" }
        ]
    },
    utilities: {
        id: "utilities",
        name: "Utilities",
        icon: Terminal,
        description: "Utilities for managing this device.",
        children: [
            { type: "app", id: "terminal" },
            { type: "app", id: "filemanager" }
        ]
    }
}



export function launchApp(appId: string): Promise<LaunchAppResult> {
    const app = appRegistry[appId];
    if (!app) {
        return Promise.resolve({ success: false, error: "App not found" });
    }
    return app.launch();
}

export function resolveEntry(
    entry: RegistryEntry,
): ResolvedRegistryEntry | undefined {
    if (entry.type === "app") {
        const app = appRegistry[entry.id];

        return app
            ? {
                type: "app",
                app,
                id: entry.id
            }
            : undefined;
    }

    const folder = folderRegistry[entry.id];

    return folder
        ? {
            type: "folder",
            folder,
            id: entry.id
        }
        : undefined;
}

export function resolveAppScreen(
    appId: string,
    routeScreenPath?: string
): ResolveAppScreenResult {
    const app = appRegistry[appId];

    if (!app) {
        return {
            success: false,
            error: "App not found"
        };
    }

    const screenPath = normalizeScreenPath(routeScreenPath);

    // the launcher handles paths differently
    // todo: maybe this could be some kind of special case for apps with dynamic route parameters, but for now this is fine lol
    if (appId === "launcher") {
        const rootScreen = app.screens["/"];

        return {
            success: true,
            app,
            appId,
            screenPath,
            controls: rootScreen.controls,
            loadScreen: rootScreen.load
        };
    }

    const loadScreen = app.screens[screenPath];

    if (!loadScreen) {
        return {
            success: false,
            error: `Screen not found for app '${appId}': ${screenPath}`
        };
    }

    return {
        success: true,
        app,
        appId,
        screenPath,
        controls: loadScreen.controls,
        loadScreen: loadScreen.load
    };
}