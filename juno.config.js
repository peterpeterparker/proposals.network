import { defineConfig } from '@junobuild/config';

/** @type {import('@junobuild/config').JunoConfig} */
export default defineConfig({
	satellite: {
		id: 'gz2uc-6yaaa-aaaal-adgyq-cai',
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
		]
	},
	orbiter: {
		id: '3iier-sqaaa-aaaal-aczaa-cai'
	}
});
