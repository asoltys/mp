<script>
	import { Buffer } from 'buffer';
	import { fade, fly } from 'svelte/transition';
	import { BIP32Factory } from 'bip32';
	import * as ecc from 'tiny-secp256k1';
	import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
	import { ECPairFactory } from 'ecpair';
	import { onMount } from 'svelte';
	import Qr from 'qrcode-base64';
	import { payments, networks } from 'liquidjs-lib';
  console.log(Qr);

	export let data;

	let address, index, pubkey, bip32, mnemonic, key, password, seed, privkey, encrypted;

	let loaded;

	onMount(async () => {
		bip32 = await BIP32Factory(ecc);
		mnemonic = generateMnemonic();
		seed = mnemonicToSeedSync(mnemonic);
		key = bip32.fromSeed(seed);
		pubkey = key.derivePath("m/49'/1'/0'/0").neutered().toBase58();
		privkey = key.toWIF();

		({ address } = payments.p2wpkh({
			pubkey: key.publicKey
		}));
		loaded = true;
	});

	let submit = async () => {
		encrypted = bip38.encrypt(key.privateKey, decoded.compressed, password);
	};

	// $: addrQr = Qr.drawImg(address);
	// $: privkeyQr = Qr.drawImg(encrypted || privkey);
</script>

<main>
	<div class="container">
		<h1 class="header">Liquid Paper Wallet</h1>

		<p>Address</p>
		<div style="display: flex">
			<p style="margin: auto"><b>{address}</b></p>
		</div>
		<img src={addrQr} />

		<p>{encrypted ? 'Encrypted' : ''} Private Key</p>
		<div style="display: flex">
			<p style="margin: auto"><b>{encrypted || privkey}</b></p>
		</div>
		<img src={privkeyQr} />

		<div style="display: flex; flex-wrap: wrap">
			<form on:submit|preventDefault={submit} style="text-align: center; margin: auto">
				<div style="margin: 10px 0">
					<input name="password" placeholder="Password" bind:value={password} autofocus />
				</div>
				<button type="submit">Yes</button>
			</form>

			<div style="width: 300px; height: 400px; padding: 40px 20px; margin: auto">
				<img
					src="/caballero.webp"
					alt="Caballero"
					in:fly={{ x: -20, duration: 400 }}
					style="width: 100%"
				/>
				<p in:fade>Want to encrypt your private key, amigo?</p>
			</div>
		</div>
	</div>
</main>

<svelte:head>
	<link
		data-n-head="ssr"
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&amp;family=Open+Sans&amp;display=swap"
	/>
</svelte:head>

<style>
	:global(body) {
		background: white;
		color: black;
		font-family: Montserrat, sans-serif;
	}

	input,
	button {
		padding: 10px;
		border-radius: 2em;
		border: 1px solid black;
		font-family: Montserrat, sans-serif;
		width: 300px;
		margin: auto;
	}

	button {
		background: #a0ada4;
		color: white;
		width: 320px;
	}

	.container {
		word-wrap: break-word;
		max-width: 800px;
		margin: 0 auto;
	}

	h1 {
		font-family: 'Montserrat', sans-serif;
		font-size: 2.5em;
		padding-bottom: 28px;
		position: relative;
	}

	.header:after {
		display: block;
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 34px;
		height: 7px;
		background-color: #a0ada4;
	}

	.invisible {
		visibility: hidden;
	}

	main {
		padding: 30px;
	}

	button.no {
		background: #99667c;
	}
</style>
