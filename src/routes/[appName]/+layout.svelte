<script lang="ts">
    import { currentDialog, closeDialog } from "$lib/dialog";
    import MBButton from "$lib/components/MBButton.svelte";
    import { fade } from "svelte/transition";

    let { children } = $props();
</script>

{@render children()}

{#if $currentDialog.dialogPresent}
    <div
        class="dialog-overlay"
        in:fade={{ duration: 100 }}
        out:fade={{ duration: 100 }}
    >
        <div class="dialog">
            <h2>{$currentDialog.title}</h2>

            <div class="dialog-content">
                {#if $currentDialog.component}
                    {@const DialogComponent = $currentDialog.component}
                    <DialogComponent {...$currentDialog.componentProps} />
                {:else if $currentDialog.message}
                    <p>{$currentDialog.message}</p>
                {/if}

                {#if $currentDialog.actions?.length}
                    <div class="dialog-actions">
                        {#each $currentDialog.actions as action}
                            <MBButton
                                label={action.label}
                                onClick={() => {
                                    action.action();
                                    closeDialog();
                                }}
                            />
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}

<style>
    .dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }

    .dialog {
        background-color: #25192d;
        padding: 2rem;
        border-radius: .25rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        width: 100%;
    }

    .dialog-content .dialog-actions {
        margin-top: 1rem;
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
    }

    h2 {
        margin: 0;
        color: rgb(255, 255, 255);
    }
</style>
