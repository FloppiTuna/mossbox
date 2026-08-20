import { goto } from "$app/navigation";
import type { Component } from "svelte";
import Terminal from "virtual:icons/fluent/window-console-20-filled";
import Smile from "virtual:icons/fluent/emoji-smile-slight-20-regular";
import BrokenHeart from "virtual:icons/fluent/heart-broken-20-filled";
import { demo } from "./demo/demo";
import { terminal } from "./terminal/terminal";
import { launcher } from "./launcher/launcher";
import { filemanager } from "./filemanager/filemanager";
import { flasher } from "./flasher/flasher";
import { portapxe } from "./portapxe/portapxe";
import { oobe } from "./internal/oobe/oobe";

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
        id: string;
    }
    | {
        type: "folder";
        folder: Folder;
        id: string;
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
    demo: demo,
    terminal: terminal,
    launcher: launcher,
    filemanager: filemanager,

    flasher: flasher,

    portapxe: portapxe,

    oobe: oobe
};

export const folderRegistry: Record<string, Folder> = {
    root: {
        id: "root",
        name: "Root",
        description: "You've been here the whole time!",
        children: [
            { type: "folder", id: "all" },
            { type: "folder", id: "rescue" },
            { type: "folder", id: "accessories" },
            { type: "folder", id: "utilities" },
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
    },


    // kitchen sink folder for apps without an entry anywhere else
    all: {
        id: "all",
        name: "All Applications",
        description: "All applications available on this device.",
        children: [
            ...Object.keys(appRegistry).map((appId) => ({ type: "app", id: appId }))
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