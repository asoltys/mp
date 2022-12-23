import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';

const base = browser ? '/api' : env.PUBLIC_API;

export const post = (url, body, jwt) => (
	fetch(base + url, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			authorization: `Bearer ${jwt}`,
			'content-type': 'application/json',
			accept: 'application/json'
		}
	})
		.then((r) => r.json())
		.catch(console.log)
);

export const stretch = async (password, salt) =>
	crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt,
			iterations: 100000,
			hash: 'SHA-256'
		},
		await crypto.subtle.importKey(
			'raw',
			new TextEncoder().encode(password),
			{ name: 'PBKDF2' },
			false,
			['deriveBits', 'deriveKey']
		),
		{ name: 'AES-GCM', length: 256 },
		true,
		['encrypt', 'decrypt']
	);
