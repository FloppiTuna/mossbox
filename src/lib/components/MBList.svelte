<script lang="ts">
    import { playUISound } from "$lib/sfx";
    import { onMount } from "svelte";

    let { items } = $props();
</script>

<main class="list">
    <ul class="nav">
        {#each items as item}
            <li>
                <button
                    type="button"
                    class="row-content row-button"
                    class:inactive={item.inactive}
                    onclick={() => {item.onClick(); playUISound("SELECT"); }}
                    onmouseenter={() => {item.onHover?.(); playUISound("NAVIGATE"); }}
                >
                    <div class="list-icon">
                        {#if item.icon}
                            <item.icon />
                        {/if}
                    </div>

                    <div>
                        <div class="list-label">{item.label}</div>
                        <div class="list-description">{item.description}</div>
                    </div>
                </button>
            </li>
        {/each}
    </ul>
</main>

<style>
    .list {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        overflow-y: auto;
        background: #000000;
    }

    .list .nav {
        min-width: 0;

        background: #000000;
        box-sizing: border-box;
    }

    .list ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .list .nav li {
        padding: 0;
        border-bottom: 1px solid #2a2a2a;
        height: 42px;
    }

    .list .nav li:hover {
        background: #2f2238;
    }

    .list .nav .row-content {
        display: flex;
        align-items: center;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        padding: 0 1rem;
        line-height: 1.25;
    }

    .list .nav .row-content.inactive {
        opacity: 0.5;
    }

    .list .nav .row-button {
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

    /* .list .nav li.active {
        background: #49315a;
    } */

    .list .nav .list-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.5rem;
        height: 1.5rem;
        margin-right: 0.6rem;
        flex: 0 0 auto;
    }

    .list .nav .list-icon :global(svg) {
        width: 100%;
        height: 100%;
    }

    .list .nav .list-description {
        font-size: 0.75rem;
        opacity: 0.75;

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
