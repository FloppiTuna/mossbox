<script>
    import MDProgressBar from "$lib/components/MBProgressBar.svelte";
    import MDDialogBox from "$lib/components/MBDialogBox.svelte";
    import MBList from "$lib/components/MBList.svelte";
    import MBButton from "$lib/components/MBButton.svelte";

    import Cursor20Filled from "virtual:icons/fluent/cursor-20-filled";

    import { playUISound } from "$lib/sfx";
    
    let demoProgress = $state(50);
</script>

<main class="demo-root">
    <p>Progress Bar</p>
    <MDProgressBar progress={demoProgress} />
    <MBButton label="Randomize progress" icon={Cursor20Filled} onClick={() => { demoProgress = Math.floor(Math.random() * 101); }} />
    <!-- <MDDialogBox actions={[
        { label: "OK", onClick: () => console.log("OK clicked") },
        { label: "Cancel", onClick: () => console.log("Cancel clicked") }
    ]}>
        <p>This is a dialog box. All changes will be lost. Spooky!</p>
    </MDDialogBox> -->

    <MBList items={[
        { label: "* Howdy! I'm Listey!", icon: Cursor20Filled, onClick: () => { } },
        { label: "* Listey the List!", icon: Cursor20Filled, onClick: () => { }},
        { label: "You are filled with LISTIFICATION.", icon: Cursor20Filled, inactive: true, onClick: () => { } }
    ]} />
</main>