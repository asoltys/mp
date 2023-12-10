<script>
	import { onMount } from 'svelte';
	import { payments } from 'liquidjs-lib';
	import * as ecc from 'tiny-secp256k1';
	import { ECPairFactory } from 'ecpair';
	import bip38 from 'bip38';
	import { page } from '$app/stores';

	const ECPair = ECPairFactory(ecc);

	let address;

	onMount(async () => {
		let { publicKey: pubkey } = ECPair.fromWIF($page.params.key);
		({ address } = payments.p2wpkh({
			pubkey
		}));

    console.log(address)
		let utxos = await fetch(`https://blockstream.info/liquid/api/address/${address}/utxo`).then(
			(r) => r.json()
		);

  console.log(utxos)
	});
</script>

{address}
