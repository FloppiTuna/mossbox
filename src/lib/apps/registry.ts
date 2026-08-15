import { goto } from "$app/navigation";
import type { Component } from "svelte";
import WindowConsole20Filled from "virtual:icons/fluent/window-console-20-filled";
import Keyboard from "virtual:icons/fluent/keyboard-20-filled";
import Cursor from "virtual:icons/fluent/cursor-20-filled";

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

export type LaunchAppResult = {
    success: boolean;
    error?: string;
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

const appRegistry: Record<string, App> = {
    demo: {
        name: "Demo",
        description: "Demo application",
        icon: WindowConsole20Filled,
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
        icon: WindowConsole20Filled,
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
        icon: WindowConsole20Filled,
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
            }
        },
        launch: () => {
            goto("/launcher");
            return Promise.resolve({ success: true });
        }
    }
};

export function launchApp(appId: string): Promise<LaunchAppResult> {
    const app = appRegistry[appId];
    if (!app) {
        return Promise.resolve({ success: false, error: "App not found" });
    }
    return app.launch();
}

export function getAppRegistry(): Record<string, App> {
    return appRegistry;
}

export function resolveAppScreen(
    appId: string,
    routeScreenPath?: string
): ResolveAppScreenResult {
    const app = appRegistry[appId];
    if (!app) {
        return { success: false, error: "App not found" };
    }

    const screenPath = normalizeScreenPath(routeScreenPath);
    const loadScreen = app.screens[screenPath];

    if (!loadScreen) {
        return {
            success: false,
            error: `Screen not found for app '${appId}': ${screenPath}`,
        };
    }

    return {
        success: true,
        app,
        appId,
        screenPath,
        controls: loadScreen.controls,
        loadScreen: loadScreen.load,
    };
}