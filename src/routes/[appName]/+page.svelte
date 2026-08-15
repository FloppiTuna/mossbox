<script lang="ts">
	import { page } from "$app/stores";
	import { resolveAppScreen } from "$lib/apps/registry";

	let resolved = $derived(resolveAppScreen($page.params.appName ?? ""));
</script>

{#if resolved.success}
	{#await resolved.loadScreen() then screenModule}
		{@const Screen = screenModule.default}
		<Screen />
	{:catch err}
		<p>Failed to load screen: {String(err)}</p>
	{/await}
{:else}
	<p>{resolved.error}</p>
{/if}