<script lang="ts">
    let { changePane } = $props();
</script>

<main class="personalization-pane">
    <h2>Personalization</h2>
    <p>Let's personalize your uConsole experience.</p>

    <input type="color" id="themeColor" name="themeColor" value="#ff0000">
    <label for="themeColor">Choose your theme color</label>

    <button onclick={() => changePane("FINISH_PANE")}>Next</button>
</main>