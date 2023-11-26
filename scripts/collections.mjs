#!/usr/bin/env node

import { listRules, setRule } from '@junobuild/admin';
import { readConfig } from './config.utils.mjs';
import { satellite } from './satellite.utils.mjs';

const list = async (type) =>
	listRules({
		type,
		satellite
	});

const configRules = async ({ type, rules }) => {
	const existingRules = await list(type);

	await Promise.all(
		rules.map(({ collection, memory, ...rest }) =>
			setRule({
				type,
				satellite,
				rule: {
					...(existingRules.find(
						({ collection: existingCollection }) => existingCollection === collection
					) ?? {}),
					collection,
					memory: memory === 'stable' ? 'Stable' : 'Heap',
					...rest
				}
			})
		)
	);
};

const setCollections = async () => {
	const {
		collections: { db, storage }
	} = await readConfig();

	await Promise.all([
		configRules({ type: 'db', rules: db }),
		configRules({ type: 'storage', rules: storage })
	]);
};

try {
	await setCollections();

	console.log('Collections configuration applied 🎉');
} catch (err) {
	console.error(err);
}
