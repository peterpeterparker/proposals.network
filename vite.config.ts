import juno from '@junobuild/vite-plugin';
import { sveltekit } from '@sveltejs/kit/vite';
import { readFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, type UserConfig } from 'vite';

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const { version } = JSON.parse(json);

const disableAnalytics = process.env.JUNO_ANALYTICS === 'disabled';

const config: UserConfig = {
	plugins: [sveltekit(), juno()],
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler'
			}
		}
	},
	build: {
		target: 'es2020',
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					const folder = dirname(id);

					const lazy = [
						'@tiptap',
						'highlight.js',
						'prosemirror',
						'lowlight',
						'markdown-it',
						'marked',
						'tiptap-markdown'
					];

					const unused = ['@dfinity/nns-proto'];

					if (
						['@sveltejs', 'svelte', ...lazy, ...unused].find((lib) => folder.includes(lib)) ===
							undefined &&
						folder.includes('node_modules')
					) {
						return 'vendor';
					}

					if (
						lazy.find((lib) => folder.includes(lib)) !== undefined &&
						unused.find((lib) => folder.includes(lib)) === undefined &&
						folder.includes('node_modules')
					) {
						return 'lazy';
					}

					if (
						unused.find((lib) => folder.includes(lib)) !== undefined &&
						folder.includes('node_modules')
					) {
						return 'unused';
					}

					return 'index';
				}
			}
		}
	},
	worker: {
		plugins: () => [sveltekit()],
		format: 'es'
	}
};

export default defineConfig(
	(): UserConfig => ({
		...config,
		define: {
			'import.meta.env.VITE_APP_VERSION': JSON.stringify(version),
			'import.meta.env.VITE_JUNO_DISABLE_ANALYTICS': JSON.stringify(disableAnalytics)
		}
	})
);
