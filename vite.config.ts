import inject from '@rollup/plugin-inject';
import { sveltekit } from '@sveltejs/kit/vite';
import { readFileSync } from 'fs';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv, type UserConfig } from 'vite';

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const { version } = JSON.parse(json);

const network = process.env.NODE_ENV === 'development' ? 'local' : 'ic';

const readCanisterIds = ({ prefix }: { prefix?: string }): Record<string, string> => {
	const canisterIdsJsonFile = ['ic', 'staging'].includes(network)
		? join(process.cwd(), 'canister_ids.json')
		: join(process.cwd(), '.dfx', 'local', 'canister_ids.json');

	if (!existsSync(canisterIdsJsonFile)) {
		console.warn(`Canister ID file ${canisterIdsJsonFile} does not exist.`);
		return {};
	}

	try {
		type Details = {
			ic?: string;
			staging?: string;
			local?: string;
		};

		const config: Record<string, Details> = JSON.parse(readFileSync(canisterIdsJsonFile, 'utf-8'));

		return Object.entries(config).reduce((acc, current: [string, Details]) => {
			const [canisterName, canisterDetails] = current;

			return {
				...acc,
				[`${prefix ?? ''}${canisterName.toUpperCase()}_CANISTER_ID`]:
					canisterDetails[network as keyof Details]
			};
		}, {});
	} catch (e) {
		console.warn(`Could not get canister ID from ${canisterIdsJsonFile}: ${e}`);
		return {};
	}
};

const dfxCanisterIds = ({ prefix }: { prefix?: string }): Record<string, string> => {
	const dfxJsonFile = join(process.cwd(), 'dfx.json');

	try {
		type DetailsId = {
			ic: string;
			local: string;
		};

		type Details = {
			remote?: {
				id: DetailsId;
			};
		};

		type DfxJson = {
			canisters: Record<string, Details>;
		};

		const { canisters }: DfxJson = JSON.parse(readFileSync(dfxJsonFile, 'utf-8'));

		return Object.entries(canisters).reduce((acc, current: [string, Details]) => {
			const [canisterName, canisterDetails] = current;

			if (canisterDetails.remote !== undefined) {
				return {
					...acc,
					[`${prefix ?? ''}${canisterName
						.replaceAll('-', '_')
						.replaceAll("'", '')
						.toUpperCase()}_CANISTER_ID`]: canisterDetails.remote.id[network as keyof DetailsId]
				};
			}

			return acc;
		}, {});
	} catch (e) {
		console.warn(`Could not get canisters ID from ${dfxJsonFile}: ${e}`);
		return {};
	}
};

const config: UserConfig = {
	plugins: [sveltekit()],
	build: {
		target: 'es2020',
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					const folder = dirname(id);

					const lazy = ['@dfinity/nns', '@dfinity/nns-proto'];

					if (
						['@sveltejs', 'svelte', ...lazy].find((lib) => folder.includes(lib)) === undefined &&
						folder.includes('node_modules')
					) {
						return 'vendor';
					}

					if (
						lazy.find((lib) => folder.includes(lib)) !== undefined &&
						folder.includes('node_modules')
					) {
						return 'lazy';
					}

					return 'index';
				}
			},
			// Polyfill Buffer for production build
			plugins: [
				inject({
					modules: { Buffer: ['buffer', 'Buffer'] }
				})
			]
		}
	},
	optimizeDeps: {
		esbuildOptions: {
			define: {
				global: 'globalThis'
			},
			plugins: [
				{
					name: 'fix-node-globals-polyfill',
					setup(build) {
						build.onResolve({ filter: /_virtual-process-polyfill_\.js/ }, ({ path }) => ({ path }));
					}
				}
			]
		}
	},
	worker: {
		plugins: [sveltekit()],
		format: 'es'
	}
};

export default defineConfig((): UserConfig => {
	// Expand environment - .env files - with canister IDs
	process.env = {
		...process.env,
		...loadEnv(network === 'ic' ? 'production' : 'development', process.cwd()),
		...dfxCanisterIds({ prefix: 'VITE_' }),
		...readCanisterIds({ prefix: 'VITE_' })
	};

	return {
		...config,
		// Backwards compatibility for auto generated types of dfx that are meant for webpack and process.env
		define: {
			'process.env': {
				...dfxCanisterIds({}),
				...readCanisterIds({}),
				DFX_NETWORK: network
			},
			'import.meta.env.VITE_APP_VERSION': JSON.stringify(version),
			'import.meta.env.VITE_DFX_NETWORK': JSON.stringify(network)
		}
	};
});
