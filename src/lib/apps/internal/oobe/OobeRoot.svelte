<script lang="ts">
    import { launchApp } from "$lib/apps/registry";
    import { showDialog, closeDialog } from "$lib/dialog";
    import { oobeCompleted } from "$lib/user";
    import { onMount } from "svelte";

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
                            launchApp("launcher");                          
                        },
                    },
                ],
            });
        }
    })

</script>

<main class="oobe-root">
    <h2>Mossbox Setup</h2>
</main>

<style>

</style>