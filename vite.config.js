import { sveltekit } from '@sveltejs/kit/vite';
import wasm from 'vite-plugin-wasm';
// import GlobalsPolyfills from '@esbuild-plugins/node-globals-polyfill';
// import inject from '@rollup/plugin-inject';
import topLevelAwait from 'vite-plugin-top-level-await';

import { nodePolyfills } from 'vite-plugin-node-polyfills'

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [nodePolyfills(), sveltekit(), wasm(), topLevelAwait()],
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:7000',
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	},
};

export default config;
