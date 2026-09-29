<script lang="ts">
    let { changePane } = $props();

    let username = $state("");
    let pin = $state("");
    let remember = $state(false);
</script>

<main class="make-user-pane">
    <h2>Make User</h2>
    <p>Who are you?</p>

    <input type="text" placeholder="name" value={username} />
    <input type="password" placeholder="pin" value={pin} />

    <input type="checkbox" id="remember" checked={remember} />
    <label for="remember">Log in automatically (insecure!)</label>
    <button onclick={() => changePane("PERSONALIZATION_PANE")}>Next</button>
</main>