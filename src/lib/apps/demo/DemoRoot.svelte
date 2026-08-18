<script>
    import MDProgressBar from "$lib/components/MBProgressBar.svelte";
    import MDDialogBox from "$lib/components/MBDialogBox.svelte";
    import MBList from "$lib/components/MBList.svelte";
    import MBButton from "$lib/components/MBButton.svelte";

    import Cursor20Filled from "virtual:icons/fluent/cursor-20-filled";

    import { playUISound } from "$lib/sfx";
    import { showDialog } from "$lib/dialog";
    import { invoke } from "@tauri-apps/api/core";

    let demoProgress = $state(50);
</script>

<main class="demo-root">
    <p>Progress Bar</p>
    <MDProgressBar progress={demoProgress} />
    <MBButton
        label="Randomize progress"
        icon={Cursor20Filled}
        onClick={() => {
            demoProgress = Math.floor(Math.random() * 101);
        }}
    />
    <!-- <MDDialogBox actions={[
        { label: "OK", onClick: () => console.log("OK clicked") },
        { label: "Cancel", onClick: () => console.log("Cancel clicked") }
    ]}>
        <p>This is a dialog box. All changes will be lost. Spooky!</p>
    </MDDialogBox> -->

    <MBList
        items={[
            {
                label: "* Howdy! I'm Listey!",
                icon: Cursor20Filled,
                onClick: () => {},
            },
            {
                label: "* Listey the List!",
                icon: Cursor20Filled,
                onClick: () => {},
            },
            {
                label: "You are filled with LISTIFICATION.",
                icon: Cursor20Filled,
                inactive: true,
                onClick: () => {},
            },
        ]}
    />

    <MBButton
        label="Open test dialog (message)"
        icon={Cursor20Filled}
        onClick={() => {
            showDialog({
                severity: "MESSAGE",
                title: "Test Dialog",
                message: "This is a test dialog.",
                actions: [
                    { label: "OK", action: () => console.log("OK clicked") },
                ],
            });
        }}
    />
    <MBButton
        label="make data dir"
        icon={Cursor20Filled}
        onClick={() => {
            invoke("create_data_folder")
                .then((result) => {
                    showDialog({
                        severity: "MESSAGE",
                        title: "Data Folder Creation",
                        message: result.message,
                        actions: [
                            { label: "OK", action: () => console.log("OK clicked") },
                        ],
                    });
                })
                .catch((error) => {
                    showDialog({
                        severity: "ERROR",
                        title: "Data Folder Creation Error",
                        message: error.message,
                        actions: [
                            { label: "OK", action: () => console.log("OK clicked") },
                        ],
                    });
                });
        }}
    />
</main>
