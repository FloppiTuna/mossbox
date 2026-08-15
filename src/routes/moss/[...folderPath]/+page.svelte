<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { getAppRegistry, launchApp } from "$lib/apps/registry";
    import type { Component } from "svelte";
    import MdiStore24Hour from "virtual:icons/mdi/store-24-hour";

    // ts kinda dumb oh well
    type TreeNode = {
        id?: string;
        name: string;
        description?: string;
        icon?: Component;
        type: "folder" | "app" | "action";
        children?: TreeNode[];

        metadata?: Record<string, unknown>;
    };

    const appEntries = Object.entries(getAppRegistry()).map(([appId, app]) => ({
        id: appId,
        name: app.name,
        description: app.description,
        icon: app.icon,
        type: "app" as const,
        metadata: { appId },
    }));

    const appTree: TreeNode = {
        name: "root",
        type: "folder",
        children: [
            {
                name: "test-folder",
                type: "folder",
                description: "A test folder",
                children: [
                    {
                        name: "nested-folder",
                        type: "folder",
                        description: "A nested folder",
                        children: [],
                    },
                ],
            },
            ...appEntries,
        ],
    };

    const getPathSegments = () =>
        $page.url.pathname.split("/").filter(Boolean).slice(1);

    const findFolder = (root: TreeNode, segments: string[]): TreeNode => {
        let current = root;

        for (const segment of segments) {
            const next = current.children?.find(
                (child) => child.type === "folder" && child.name === segment,
            );

            if (!next) {
                return root;
            }

            current = next;
        }

        return current;
    };

    let pathSegments = $derived(getPathSegments());
    let currentFolder = $derived(findFolder(appTree, pathSegments));
    let visibleItems = $derived(currentFolder.children ?? []);
    let selectedItem = $state<TreeNode | null>(null);

    const folderPathFor = (folderName: string) => {
        const nextSegments = [...pathSegments, folderName];
        return `/moss/${nextSegments.join("/")}`;
    };

    const goToFolder = (folderName: string) => {
        void goto(folderPathFor(folderName));
    };

    const goToParent = () => {
        if (pathSegments.length === 0) {
            return;
        }

        const parentSegments = pathSegments.slice(0, -1);
        const parentPath =
            parentSegments.length > 0
                ? `/moss/${parentSegments.join("/")}`
                : "/moss";
        void goto(parentPath);
    };
</script>

<main class="browser">
    <!-- browser tree -->
    <div class="tree">
        <ul>
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
                    <span class="row-content inactive"
                        >This folder is empty.</span
                    >
                </li>
            {/if}

            {#each visibleItems as child}
                <li
                    class:active={(child.id ?? child.name) === (selectedItem?.id ?? selectedItem?.name)}
                    onmouseenter={() => (selectedItem = child)}
                    onmouseleave={() => (selectedItem = null)}
                >
                    {#if child.type === "folder"}
                        <button
                            type="button"
                            class="row-content row-button"
                            onclick={() => goToFolder(child.name)}
                        >
                            <div class="list-icon">
                                {#if child.icon}
                                    <child.icon />
                                {/if}
                            </div>
                            {child.name}
                        </button>
                    {:else if child.type === "app"}
                        <button
                            type="button"
                            class="row-content row-button"
                            onclick={() =>
                                launchApp(
                                    String(
                                        child.metadata?.appId ??
                                            child.id ??
                                            child.name,
                                    ),
                                )}
                        >
                            <div class="list-icon">
                                {#if child.icon}
                                    <child.icon />
                                {/if}
                            </div>
                            <div class="list-label">
                                {child.name}
                            </div>
                        </button>
                    {:else if child.type === "action"}
                        <span class="row-content">
                            <span class="list-icon">
                                {#if child.icon}
                                    <child.icon />
                                {:else}
                                    ⚡
                                {/if}
                            </span>
                            {child.name}
                        </span>
                    {/if}
                </li>
            {/each}
        </ul>
    </div>

    <!-- details pane -->
    <div class="details">
        <h2>Location</h2>
        <p>/{pathSegments.join("/") || ""}</p>
        <!-- description -->
        <p>{selectedItem?.description}</p>
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

    .browser .tree ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .browser .tree li {
        padding: 0;
        border-bottom: 1px solid #2a2a2a;
        height: 42px;
    }

    .browser .tree li:hover {
        background: #2f2238;
    }

    .browser .tree .row-content {
        display: flex;
        align-items: center;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        padding: 0 1rem;
        line-height: 1.25;
    }

    .browser .tree .row-content.inactive {
        opacity: 0.5;
    }

    .browser .tree .row-button {
        text-align: left;
        background: transparent;
        color: inherit;
        border: 0;
        margin: 0;
        cursor: pointer;
        font: inherit;
        line-height: inherit;
        appearance: none;
    }

    .browser .tree li.active {
        background: #49315a;
    }

    .browser .tree .list-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.5rem;
        height: 1.5rem;
        margin-right: 0.6rem;
        flex: 0 0 auto;
    }

    .browser .tree .list-icon :global(svg) {
        width: 100%;
        height: 100%;
    }

    .browser .details {
        flex: 2 1 0;
        min-width: 0;

        background: #000000;
        box-sizing: border-box;
        padding: 0.8rem 1rem;
    }

    .browser .details h2 {
        margin: 0 0 0.5rem;
        font-size: 0.95rem;
    }

    .browser .details p {
        margin: 0;
        color: #bfaacb;
        overflow-wrap: anywhere;
    }
</style>
