<script lang="ts">
    type Props = {
        children: () => any;
        actions?: {
            label: string;
            onClick: () => void;
        }[];
    };

    let { children, actions } = $props();
    let self: HTMLElement;
</script>

<main class="dialog-box" bind:this={self}>
    <div class="dialog-content">
        {@render children()}
    </div>
    {#if actions && actions.length > 0}
        <div class="dialog-actions">
            {#each actions as action}
                <button onclick={() => {
                    action.onClick();
                    // destroy self
                    self.remove(); // todo: DO THIS PROPERLYYY AUUGFGHREWSHGVFUYEWHUFGVHEWUJFHGV
                }}>{action.label}</button>
            {/each}
        </div>
    {/if}
</main>

<style>
    .dialog-box {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #08000e;
        border-radius: .25rem;
        z-index: 1000;
    }

    .dialog-content {
        padding: 2rem;
        border-radius: .25rem;
    }

    .dialog-actions {
        display: flex;
        justify-content: flex-end;
        padding: 1rem;
        border-top: 1px solid #4b0080;
    }
</style>