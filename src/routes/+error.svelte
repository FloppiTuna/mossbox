<script>
	import { page } from '$app/state';
</script>

<main class="error-page">
    <p>Oops! Something weird happened.</p>
    <p>You can press "Enter" to attempt to reload and recover. If that doesn't work, you can escape to the desktop by pressing "Esc" now.</p>
    <p>Error details: {page.error?.message}</p>
</main>