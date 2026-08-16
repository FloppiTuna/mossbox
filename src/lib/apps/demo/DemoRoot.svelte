<script>
    import MDProgressBar from "$lib/components/MBProgressBar.svelte";
    import MDDialogBox from "$lib/components/MBDialogBox.svelte";
    import MBList from "$lib/components/MBList.svelte";
    import Cursor20Filled from "virtual:icons/fluent/cursor-20-filled";

    import { playUISound } from "$lib/sfx";

</script>

<main class="demo-root">
    <p>TESTTEST</p>
    <MDProgressBar progress={100} />
    <MDDialogBox actions={[
        { label: "OK", onClick: () => console.log("OK clicked") },
        { label: "Cancel", onClick: () => console.log("Cancel clicked") }
    ]}>
        <p>This is a dialog box. All changes will be lost. Spooky!</p>
    </MDDialogBox>

    <MBList items={[
        { label: "navigate", icon: Cursor20Filled, onClick: () => { playUISound("NAVIGATE"); console.log("Item 1 clicked") } },
        { label: "select", icon: Cursor20Filled, onClick: () => { playUISound("SELECT"); console.log("Item 2 clicked") } },
        { label: "back", icon: Cursor20Filled, inactive: true, onClick: () => { playUISound("BACK"); console.log("Item 3 clicked") } }
    ]} />
</main>