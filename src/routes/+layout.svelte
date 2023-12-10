<script>
	import '../app.css';
</script>

<main>
	<div class="container">
    <a href="/" style="text-decoration: none; color: black">
			<h1 class="header">Liquid Paper Wallet</h1>
		</a>
		<slot />
	</div>
</main>

<svelte:head>
	<link
		data-n-head="ssr"
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&amp;family=Open+Sans&amp;display=swap"
	/>
</svelte:head>

<style global>
	:global(body) {
		background: white;
		color: black;
		font-family: Montserrat, sans-serif;
	}
</style>
