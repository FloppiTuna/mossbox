<script lang="ts">
    import { closeDialog, showDialog } from "$lib/dialog";
    import { createUser } from "$lib/user";

    let { changePane } = $props();

    let username = $state("");
    let pin = $state("");
    let remember = $state(false);

    async function submitUser() {
        showDialog({
            severity: "MESSAGE",
            title: "Creating user...",
            message: "Please wait while Mossbox creates your user account.",
        });

        await createUser(username, pin)
            .then(() => {
                closeDialog();
                changePane("FINISH_PANE");
            })
            .catch((error) => {
                closeDialog();
                showDialog({
                    severity: "ERROR",
                    title: "User Creation Error",
                    message: `Failed to create user: ${error.message}`,
                });
            });

    }

</script>

<main class="make-user-pane">
    <h2>Make User</h2>
    <p>Who are you?</p>

    <input type="text" placeholder="name" bind:value={username} />
    <input type="password" placeholder="pin" bind:value={pin} />

    <input type="checkbox" id="remember" bind:checked={remember} />
    <label for="remember">Log in automatically (insecure!)</label>
    <button onclick={() => submitUser()}>Next</button>
</main>