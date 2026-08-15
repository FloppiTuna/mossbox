<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import { slide, fade } from "svelte/transition";

    import GameControllerA from "virtual:icons/fluent/game-controller-button-a-20-filled";
    import GameControllerB from "virtual:icons/fluent/game-controller-button-b-20-filled";
    import GameControllerX from "virtual:icons/fluent/game-controller-button-x-20-filled";
    import GameControllerY from "virtual:icons/fluent/game-controller-button-y-20-filled";
    import { resolveAppScreen } from "$lib/apps/registry";

    let appId = $derived(page.params.appName);
    let screenPath = $derived(page.params.screenPath);

    let resolvedScreen = $derived(resolveAppScreen(appId || "", screenPath)); //what

    let { children } = $props();
    let batteryLevel = $state(100);
    let pathname = $derived(page.url.pathname);

    let time = $state(new Date());

    // keep track of time
    const updateTime = () => {
        time = new Date();
    };

    // Update the time every minute
    setInterval(updateTime, 1000);
    // Update the time immediately on mount
    updateTime();

    function onKeyPressed(event: KeyboardEvent) {
        if (event.key === "Escape") {
            event.preventDefault();
            void goto("/moss");
        } else {
            console.log(`Key pressed: ${event.key}`);
        }
    }
</script>

<svelte:window onkeydown={onKeyPressed} />

<main class="moss">
    <div class="title-bar">
        <!-- Title bar content -->
        <div class="title">mossbox {pathname}</div>
        <!-- battery + time -->
        <div class="status">{time.toLocaleString()}</div>
    </div>
    <div class="content">
        {#key pathname}
            <div
                class="page-shell"
                in:fade={{ duration: 150, delay: 200 }}
                out:fade={{ duration: 100 }}
            >
                {@render children()}
            </div>
        {/key}
    </div>
    <div class="footer">
        <!-- Footer content -->
        <div class="control-legend">
            <!-- icon, then action -->
            <!-- <div class="control">
                <GameControllerA />
                <span>Back</span>
            </div>
            <div class="control">
                <GameControllerB />
                <span>Cancel</span>
            </div> -->
            {#if resolvedScreen.success}
                {#each resolvedScreen.controls ?? [] as control}
                    <div class="control">
                        <control.icon />
                        <span>{control.label}</span>
                    </div>
                {/each}
                <!-- {:else}
                <div class="control">
                    <span>{resolvedScreen.error}</span>
                </div> -->
            {/if}
        </div>
        <!-- this is mostly just for nerds who want news and crap LOL -->
        <!-- itll probably be restricted to its own little spot later on or used for notifications but who knows its mostly just to give it coolness -->
        <div class="rss-feed">
            <div class="rss-track">
                <span>Breaking News; I am sleepy</span>
                <span>Toby Fox announces "UNDERTALE 2": "I don't even care anymore"</span>
                <span>Microsoft announces deprecation of feature you just convinced the boss to start using after a 4 hour long meeting</span>
                <span>i need to actually implement this sigh</span>
                <span>uhhhhhhh</span>
            </div>
        </div>
    </div>
</main>

<style>
    :global(html),
    :global(body) {
        width: 100%;
        height: 100%;
        margin: 0;
        overflow: hidden;
    }

    :global(body) {
        background: #000000;
        color: #f4f8f1;
        font-family: "Avenir Next";
        -webkit-font-smoothing: antialiased;
    }

    .moss {
        width: 100%;
        height: 100%;
        min-height: 0;

        display: flex;
        flex-direction: column;

        overflow: hidden;
    }

    .title-bar {
        padding: 0.5rem;
        background: #000000;
        border-bottom: 2px solid #2a2a2a;
        display: flex;
        justify-content: space-between;
        flex-direction: row;
    }

    .content {
        flex: 1 1 0;
        min-width: 0;
        min-height: 0;

        padding: 1rem;
        box-sizing: border-box;

        background: linear-gradient(
            140deg,
            #151017 0%,
            #261a2a 55%,
            #100b12 100%
        );

        overflow: hidden;
    }

    .page-shell {
        width: 100%;
        height: 100%;
        min-width: 0;
        min-height: 0;
    }

    .title-bar .title {
        font-weight: bold;
    }

    .footer {
        height: 2.25rem;
        background: #000000;
        border-top: 2px solid #2a2a2a;
        display: flex;
        align-items: center;
    }

    .footer .control-legend {
        flex: 0 0 65%;
        height: 100%;
        box-sizing: border-box;

        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0 1rem;

        border-right: 2px solid #2a2a2a;
    }

    .footer .control-legend .control {
        font-size: 1rem;
        opacity: 1;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .footer .rss-feed {
        flex: 0 0 35%;
        min-width: 0;
        overflow: hidden;
        white-space: nowrap;
        padding: 0 1rem;
        font-size: 0.85rem;
        opacity: 0.75;
    }

    .footer .rss-track {
        width: max-content;
        animation: marquee 45s linear infinite;
    }

    .footer .rss-feed span {
        display: inline-block;
    }

    .footer .rss-feed span::after {
        content: " | ";
        margin: 0 0.5rem;
    }

    @keyframes marquee {
        from {
            transform: translateX(100vw);
        }

        to {
            transform: translateX(-100%);
        }
    }
</style>
