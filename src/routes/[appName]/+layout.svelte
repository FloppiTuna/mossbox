<script lang="ts">
    import { currentDialog, closeDialog } from "$lib/dialog";
    import MBButton from "$lib/components/MBButton.svelte";
    import { fade } from "svelte/transition";

    let { children } = $props();
</script>

{@render children()}

{#if $currentDialog.dialogPresent}
    <div class="dialog-overlay" in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
        <div class="dialog-content">
            <h2>{$currentDialog.title}</h2>
            <p>{$currentDialog.message}</p>
            {#if $currentDialog.actions}
                <div class="dialog-actions">
                    {#each $currentDialog.actions as action}
                        <MBButton label={action.label} onClick={() => {
                            action.action(); // lol
                            closeDialog(); // todo: should this be done automatically??
                        }} />
                    {/each}
                </div>
            {/if}
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
</style>