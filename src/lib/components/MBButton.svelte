<script lang="ts">
    import { playUISound } from "$lib/sfx";
    import type { Component } from "svelte";

    let { label, icon, inactive, onClick } = $props<{
        label: string;
        icon?: Component;
        inactive?: boolean;
        onClick?: () => void;
    }>();
</script>
<!-- naming is kind of ambiguous oops -->
<main class="button"> 
    <button class:inactive={inactive} onmouseenter={() => playUISound("NAVIGATE")} onclick={() => { onClick?.(); playUISound("SELECT"); }}>
        {#if icon}
            <div class="list-icon">
                <icon></icon>
            </div>
        {/if}
        <span class="label">{label}</span>
    </button>
</main>

<style>
    .button {
        display: flex;
    }

    .button button {
        display: flex;
        align-items: center;

        padding: 0.6rem 1.0rem;

        border: none;
        background-color: #000000;
        color: #ffffff;

        font-size: 0.9rem;
        font-weight: 500;

        cursor: pointer;

        /* transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out; */
    }

    button:hover {
        background-color: #2f2238;
    }

    button:active {
        background-color: #49315a;
    }

    button.inactive {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>