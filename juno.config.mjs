import { defineConfig } from '@junobuild/config';

/** @type {import('@junobuild/config').JunoConfig} */
export default defineConfig({
	satellite: {
		ids: {
			production: 'gz2uc-6yaaa-aaaal-adgyq-cai',
			development: 'atbka-rp777-77775-aaaaq-cai'
		},
		source: 'build',
		storage: {
			headers: [
				{
					source: '**/*.png',
					headers: [['Cache-Control', 'max-age=604800']]
				},
				{
					source: '**/fonts/**/*',
					headers: [['Cache-Control', 'public, max-age=31536000']]
				}
			]
		},
		predeploy: ['npm run build'],
		precompress: [
			{
				pattern: '**/*.+(js|mjs|css)',
				algorithm: 'brotli',
				mode: 'replace'
			},
			{
				pattern: '**/*.html',
				algorithm: 'brotli',
				mode: 'both'
			}
		],
		collections: {
			datastore: [
				{
					collection: 'metadata',
					read: 'managed',
					write: 'managed',
					memory: 'stable',
					mutablePermissions: true
				},
				{
					collection: 'content',
					read: 'managed',
					write: 'managed',
					memory: 'stable',
					mutablePermissions: true
				},
				{
					collection: 'neuron',
					read: 'managed',
					write: 'managed',
					memory: 'stable',
					mutablePermissions: true
				}
			],
			storage: [
				{
					collection: 'sns-parameters',
					read: 'managed',
					write: 'managed',
					memory: 'stable',
					mutablePermissions: true
				},
				{
					collection: 'sns-logo',
					read: 'managed',
					write: 'managed',
					memory: 'stable',
					mutablePermissions: true
				}
			]
		},
		authentication: {
			google: {
				clientId: '974645854757-ebf6equ4ceskmeqahu83e1qqmm7ndrod.apps.googleusercontent.com'
			}
		}
	},
	orbiter: {
		id: '3iier-sqaaa-aaaal-aczaa-cai'
	},
	emulator: {
		skylab: {},
		network: {
			services: {
				sns: true,
				nns_dapp: true
			}
		}
	}
});
