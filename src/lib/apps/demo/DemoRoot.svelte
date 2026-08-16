<script>
    import MDProgressBar from "$lib/components/MBProgressBar.svelte";
    import MDDialogBox from "$lib/components/MBDialogBox.svelte";
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
</main>