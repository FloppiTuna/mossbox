<script lang="ts">
    let { progress } = $props<{
        progress: number;
    }>();
</script>

<main class="progress-bar">
    <div class="progress" style="width: {progress}%"></div>
</main>

<style>
    .progress-bar {
        width: 100%;
        height: 1.25rem;
        background-color: black;
        border-radius: 0.25rem;
        overflow: hidden;
        position: relative;
    }

    .progress {
        height: 100%;
        background-color: #2b004b;
        border-radius: 0.25rem;
        position: relative;
        overflow: hidden;
        transition: width 0.4s ease;
    }

    .progress::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
        background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0) 100%
        );
        animation: shimmer 2s infinite linear;
    }

    @keyframes shimmer {
        100% {
            transform: translateX(100%);
            opacity: 0;
        }
    }
</style>
