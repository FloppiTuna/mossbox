<script lang="ts">
    import { launchApp } from "$lib/apps/registry";
    import { showDialog, closeDialog } from "$lib/dialog";
    import { oobeCompleted } from "$lib/user";
    import { onMount, type Component } from "svelte";

    import WelcomePane from "./panes/WelcomePane.svelte";
    import CheckHardwarePane from "./panes/CheckHardwarePane.svelte";
    import PickConnectionType from "./panes/PickConnectionType.svelte";
    import WirelessConnectionPane from "./panes/WirelessConnectionPane.svelte";
    
    type Pane = {
        title: string;
        content: Component<{ changePane: (newPane: string) => void }>;
    };

    const panes: Record<string, Pane> = {
        WELCOME_PANE: {
            title: "Welcome to Mossbox",
            content: WelcomePane,
        },

        
        PICK_CONNECTION_TYPE_PANE: {
            title: "Pick Connection Type",
            content: PickConnectionType,
        },

        WIRELESS_CONNECTION_PANE: {
            title: "Wireless Connection",
            content: WirelessConnectionPane,
        },


        CHECK_HARDWARE_PANE: {
            title: "Checking Hardware",
            content: CheckHardwarePane,
        }
    };

    let currentPane = $state("WELCOME_PANE");

    onMount(() => {
        // check if oobe even needs to run
        if (oobeCompleted()) {
            // if oobe is already completed, show a dialog and close the app
            showDialog({
                severity: "ERROR",
                title: "Setup Already Completed",
                message: "Mossbox setup has already been completed. Get outta here!",
                actions: [
                    {
                        label: "Close",
                        action: () => {
                            closeDialog();
                            launchApp("launcher");                          
                        },
                    },
                ],
            });
        } else {
            currentPane = "WELCOME_PANE"; // start the OOBE process
        }
    })

</script>

<main class="oobe-root">
    <div class="oobe-content">
        {#if panes[currentPane]}
            {@const PaneComponent = panes[currentPane].content}
            <PaneComponent changePane={(newPane: string) => { currentPane = newPane; }} />
        {:else}
            <p>Unknown pane: {currentPane}.</p>
        {/if}
        <!-- pane -->
    </div>
</main>

<style>
    .oobe-root {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 1rem;
        height: 100%;
    }

    .oobe-content {
        width: 100%;
        max-width: 800px;
        height: 100%;
        max-height: 400px;
        background-color: #1a1a1a;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: 2rem;
        display: flex;
        flex-direction: column;
    }
</style>