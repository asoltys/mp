<script>
	import { fade, fly } from 'svelte/transition';

	export let msg;
</script>

<div style="width: 300px; padding: 40px 20px; margin: auto">
	<img
		src="/caballero.webp"
		alt="Caballero"
		in:fly={{ x: -20, duration: 400 }}
		style="width: 100%"
	/>
	<p in:fade>
		{msg}
	</p>
</div>
