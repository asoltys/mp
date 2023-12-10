<script>
	import Guide from '$lib/Guide.svelte';

	import { Buffer } from 'buffer';
	import { BIP32Factory } from 'bip32';
	import * as ecc from 'tiny-secp256k1';
	import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
	import { onMount } from 'svelte';
	import Qr from 'qrcode-base64';
	import { payments } from 'liquidjs-lib';
	import bip38 from 'bip38';
	import 'setimmediate';

	export let data;

	let address,
		pk,
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

	onMount(generate);

	let sweeping;
	let start = async () => {
		sweeping = true;
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

{#if mnemonic}
	<p>Address</p>

	<div style="display: flex; word-break: break-all">
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
		<div style="display: flex; word-break: break-all">
			<p style="margin: auto"><b>{encrypted || privkey}</b></p>
		</div>

		<div style="display: flex">
			<img src={privQr} style="margin: 20px auto" />
		</div>
	{/if}
{/if}

{#if !(encrypting || display)}
	<div style="display: flex; flex-wrap: wrap">
		<Guide msg="Want to encrypt your key?" />

		<form on:submit|preventDefault={encrypt} style="text-align: center; margin: auto">
			<div style="margin: 10px 0">
				<input name="password" placeholder="Password" bind:value={password} autofocus />
			</div>
			<button type="submit">Yes</button>
			<button type="button" class="no" on:click={() => (display = true)}>No</button>
		</form>
	</div>
{/if}

<svelte:head>
	<link
		data-n-head="ssr"
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&amp;family=Open+Sans&amp;display=swap"
	/>
</svelte:head>
