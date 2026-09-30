<script lang="ts">
    import { authenticateUser, getUserList } from "$lib/user";
    import { onMount } from "svelte";
    import { playUISound } from "$lib/sfx";
    import Person from "virtual:icons/fluent/person-48-filled";
    import MBButton from "$lib/components/MBButton.svelte";
    import { showDialog } from "$lib/dialog";
    import { goto } from "$app/navigation";

    let users = $state<{ id: number; name: string }[]>([]);
    let selectedUserId = $state<number | null>(null);

    let pin = $state<string>("");

    let timesTried = $state<number>(0);

    onMount(async () => {
        users = await getUserList();
    });

    function selectUser(userId: number) {
        selectedUserId = userId;
        playUISound("SELECT");
    }

    async function loginUser(userId: number, pin: string) {
        const result = await authenticateUser(userId, pin);
        if (result) {
            // this is really secure :DD
            goto("/launcher");
        } else {
            timesTried += 1;
            showDialog({
                severity: "ERROR",
                title: "Login Failed",
                message: "Your PIN was incorrect. Please try again." + (timesTried >= 3 ? " If you continue to have trouble, please consult the documentation for Resetting your Password." : ""),
                actions: [
                    {
                        label: "OK",
                        action: () => {
                            playUISound("SELECT");
                        },
                    },
                ],
            });
        }
    }

</script>

<main class="login-root">
    <!-- todo should these be split into different paths or is that fucking STUPID -->
    {#if selectedUserId !== null}
        <div class="user-logon">
            <h2>Log in as {users.find((user) => user.id === selectedUserId)?.name}</h2>
            <p>Enter your PIN:</p>
            <input type="password" placeholder="PIN" bind:value={pin} />
            <MBButton label="Log In" onClick={() => loginUser(selectedUserId!, pin)} />
            <MBButton label="Back" onClick={() => (selectedUserId = null)} />
        </div>
    {:else}
        <div class="user-list">
            {#each users as user}
                <!-- todo: should this maybe be turned into an element for use with MBButton? idk -->
                <button
                    class="user-entry"
                    class:selected={selectedUserId === user.id}
                    type="button"
                    aria-pressed={selectedUserId === user.id}
                    onclick={() => selectUser(user.id)}
                    onmouseenter={() => playUISound("NAVIGATE")}
                >
                    <div class="user-icon">
                        <Person />
                    </div>
                    <div class="user-name">{user.name}</div>
                </button>
            {/each}
        </div>
    {/if}
</main>

<style>
    .login-root {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    .user-list {
        display: flex;
        flex-direction: row;
        gap: 1rem;
    }

    .user-entry {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 0.5rem 1rem;
        border: 1px solid #ccc;
        cursor: pointer;
        background-color: #2f2238;
        color: inherit;
        font: inherit;
        transition: background-color 0.2s;

        height: 10rem;
        width: 10rem;
        justify-content: center;
    }

    .user-entry:hover {
        background-color: #49315a;
    }

    .user-entry:active,
    .user-entry.selected {
        background-color: #49315a;
    }

    .user-icon {
        font-size: 3rem;
    }

    .user-name {
        font-size: 1.2rem;
        font-weight: normal;
    }
</style>
