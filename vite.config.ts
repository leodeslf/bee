import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		cssTarget: 'esnext', // Modern CSS won't work with other options.
		target: 'esnext',
	},
	plugins: [sveltekit()]
});
