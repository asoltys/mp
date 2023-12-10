<script>
	import Guide from '$lib/Guide.svelte';
	let key = "L3TMzDrfEf1PgwB7JPPtcZE3cHxFo61x6uksRwK79ANMaEStf38h";
</script>

<div style="display: flex; flex-wrap: wrap">
	<Guide msg="Hello, friend" />

	<div style="margin: auto">
		<a href="/generate">
			<button style="height: 50px; cursor: pointer">New Wallet</button>
		</a>
		<div style="margin: 10px 0">
			<input name="key" placeholder="Check an existing private key" bind:value={key} autofocus />
		</div>
    <a href={`/sweep/${key}`}>
			<button style="height: 50px; cursor: pointer">Check</button>
		</a>
	</div>
</div>
