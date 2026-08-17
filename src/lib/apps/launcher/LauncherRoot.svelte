<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import type { Component } from "svelte";
    import MdiStore24Hour from "virtual:icons/mdi/store-24-hour";
    import ArrowLeft20Filled from "virtual:icons/fluent/arrow-left-20-filled";

    import {
        appRegistry,
        folderRegistry,
        launchApp,
        type App,
        type Folder,
        type RegistryEntry,
    } from "$lib/apps/registry";
    import MBList from "$lib/components/MBList.svelte";

    type ResolvedItem =
        | {
              type: "app";
              id: string;
              app: App;
          }
        | {
              type: "folder";
              id: string;
              folder: Folder;
          };

    const getPathSegments = () =>
        $page.url.pathname.split("/").filter(Boolean).slice(1);

    const resolveEntry = (entry: RegistryEntry): ResolvedItem | undefined => {
        if (entry.type === "app") {
            const app = appRegistry[entry.id];

            if (!app) {
                return undefined;
            }

            return {
                type: "app",
                id: entry.id,
                app,
            };
        }

        const folder = folderRegistry[entry.id];

        if (!folder) {
            return undefined;
        }

        return {
            type: "folder",
            id: entry.id,
            folder,
        };
    };

    const findFolder = (
        root: Folder,
        segments: string[],
    ): Folder | undefined => {
        let current = root;

        for (const segment of segments) {
            const nextEntry = current.children.find(
                (entry) => entry.type === "folder" && entry.id === segment,
            );

            if (!nextEntry || nextEntry.type !== "folder") {
                return undefined;
            }

            const nextFolder = folderRegistry[nextEntry.id];

            if (!nextFolder) {
                return undefined;
            }

            current = nextFolder;
        }

        return current;
    };

    let pathSegments = $derived(getPathSegments());

    let currentFolder = $derived(
        findFolder(folderRegistry.root, pathSegments) ?? folderRegistry.root,
    );

    let visibleItems = $derived(
        currentFolder.children
            .map(resolveEntry)
            .filter((item): item is ResolvedItem => {
                if (!item) {
                    return false;
                }

                if (item.type === "app") {
                    return item.app.showInLauncher !== false;
                }

                return true;
            }),
    );

    let selectedItem = $state<ResolvedItem | null>(null);

    const folderPathFor = (folder: Folder) => {
        const nextSegments = [...pathSegments, folder.id];

        return `/launcher/${nextSegments.join("/")}`;
    };

    const goToFolder = (folder: Folder) => {
        void goto(folderPathFor(folder));
    };

    const goToParent = () => {
        if (pathSegments.length === 0) {
            return;
        }

        const parentSegments = pathSegments.slice(0, -1);

        const parentPath =
            parentSegments.length > 0
                ? `/launcher/${parentSegments.join("/")}`
                : "/launcher";

        void goto(parentPath);
    };

    const getItemName = (item: ResolvedItem) =>
        item.type === "app" ? item.app.name : item.folder.name;

    const getItemDescription = (item: ResolvedItem) =>
        item.type === "app" ? item.app.description : item.folder.description;

    const getItemIcon = (item: ResolvedItem) =>
        item.type === "app" ? item.app.icon : item.folder.icon;
</script>

<main class="browser">
    <div class="tree">
        <!-- <ul>
            {#if pathSegments.length > 0}
                <li class="folder-nav">
                    <button
                        type="button"
                        class="row-content row-button"
                        onclick={goToParent}
                    >
                        ⬅ back...
                    </button>
                </li>
            {/if}

            {#if visibleItems.length === 0}
                <li class="empty-folder">
                    <span class="row-content inactive">
                        This folder is empty.
                    </span>
                </li>
            {/if}

            {#each visibleItems as item}
                <li
                    class:active={item === selectedItem}
                    onmouseenter={() => (selectedItem = item)}
                    onmouseleave={() => (selectedItem = null)}
                >
                    {#if item.type === "folder"}
                        <button
                            type="button"
                            class="row-content row-button"
                            onclick={() => goToFolder(item.folder)}
                        >
                            <div class="list-icon">
                                {#if item.folder.icon}
                                    <item.folder.icon />
                                {/if}
                            </div>

                            <div class="list-label">
                                {item.folder.name}
                            </div>
                        </button>
                    {:else}
                        <button
                            type="button"
                            class="row-content row-button"
                            onclick={() => launchApp(item.id)}
                        >
                            <div class="list-icon">
                                {#if item.app.icon}
                                    <item.app.icon />
                                {/if}
                            </div>

                            <div class="list-label">
                                {item.app.name}
                            </div>
                        </button>
                    {/if}
                </li>
            {/each}
        </ul> -->
        <MBList
            items={[
                ...(pathSegments.length > 0
                    ? [
                          {
                              label: "Back...",
                              icon: ArrowLeft20Filled,
                              onClick: goToParent,
                          },
                      ]
                    : []),
                ...visibleItems.map((item) => ({
                    label: getItemName(item),
                    description: getItemDescription(item),
                    icon: getItemIcon(item),
                    onClick:
                        item.type === "folder"
                            ? () => goToFolder(item.folder)
                            : () => launchApp(item.id),
                })),
            ]}
        />
    </div>

    <div class="details">
        {#if selectedItem}
            <p>
                {getItemDescription(selectedItem)}
            </p>
        {/if}
    </div>
</main>

<style>
    .browser {
        width: 100%;
        height: 100%;
        min-width: 0;
        min-height: 0;

        display: flex;
        flex-direction: row;
        align-items: stretch;

        gap: 1.2rem;
        box-sizing: border-box;
    }

    .browser .tree {
        flex: 3 1 0;
        min-width: 0;

        background: #000000;
        box-sizing: border-box;
    }

   
    .browser .details {
        flex: 2 1 0;
        min-width: 0;

        background: #000000;
        box-sizing: border-box;
        padding: 0.8rem 1rem;
    }
    .browser .details p {
        margin: 0;
        color: #bfaacb;
        overflow-wrap: anywhere;
    }
</style>
