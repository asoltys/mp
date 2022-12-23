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
	import bip38 from 'bip38';
	import 'setimmediate';

	export let data;

	let address,
		index,
		bip32,
		mnemonic,
		key,
		password,
		seed,
		privkey,
		display,
		encrypted,
		encrypting,
		addrQr,
		privQr;

	let loaded;

	let generate = async () => {
		bip32 = await BIP32Factory(ecc);
		mnemonic = generateMnemonic();
		seed = mnemonicToSeedSync(mnemonic);
		key = bip32.fromSeed(seed).derivePath("m/49'/1'/0'/0/0");
		privkey = key.toWIF();

		({ address } = payments.p2wpkh({
			pubkey: key.publicKey
		}));

		addrQr = Qr.drawImg(address, { size: 300 });
		privQr = Qr.drawImg(privkey, { size: 300 });
		loaded = true;
	};

	let encrypt = async () => {
		encrypting = true;
		encrypted = await bip38.encryptAsync(key.privateKey, true, password);
		privQr = Qr.drawImg(encrypted, { size: 300 });
		encrypting = false;
		display = true;
	};

	let progress = (status) => {
		console.log(status);
	};
</script>

<main>
	<div class="container">
		<h1 class="header">Liquid Paper Wallet</h1>

		{#if mnemonic}
			<p>Address</p>

			<div style="display: flex">
				<p style="margin: auto"><b>{address}</b></p>
			</div>

			<div style="display: flex">
				<img src={addrQr} style="margin: 20px auto" />
			</div>

			{#if encrypting}
				<div style="display: flex">
					<img src="/stevus.webp" style="margin: 20px auto; width: 200px" />
				</div>
			{/if}

			{#if display}
				<p>{encrypting ? 'Encrypting' : encrypted ? 'Encrypted' : ''} Private Key</p>
				<div style="display: flex">
					<p style="margin: auto"><b>{encrypted || privkey}</b></p>
				</div>

				<div style="display: flex">
					<img src={privQr} style="margin: 20px auto" />
				</div>
			{/if}
		{/if}

		{#if !(encrypting || display)}
			<div style="display: flex; flex-wrap: wrap">
				{#if mnemonic}
					<form on:submit|preventDefault={encrypt} style="text-align: center; margin: auto">
						<div style="margin: 10px 0">
							<input name="password" placeholder="Password" bind:value={password} autofocus />
						</div>
						<button type="button" class="no" on:click={() => (display = true)}>No</button>
						<button type="submit">Yes</button>
					</form>
				{:else}
					<form on:submit|preventDefault={generate} style="text-align: center; margin: auto">
						<button type="submit">Yes</button>
					</form>
				{/if}

				<div style="width: 300px; height: 400px; padding: 40px 20px; margin: auto">
					<img
						src="/caballero.webp"
						alt="Caballero"
						in:fly={{ x: -20, duration: 400 }}
						style="width: 100%"
					/>
					<p in:fade>
						{mnemonic ? 'Want to encrypt your private key, amigo?' : 'Ready to begin, amigo?'}
					</p>
				</div>
			</div>
		{/if}
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
		margin: auto;
		width: 300px;
	}

	button {
		background: #a0ada4;
		color: white;
		width: 180px;
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
