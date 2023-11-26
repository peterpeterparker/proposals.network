#!/usr/bin/env node

import pkgPrincipal from '@dfinity/principal';
import { getActor } from './actor.utils.mjs';
import { readConfig } from './config.utils.mjs';

const { Principal } = pkgPrincipal;

const setControllers = async () => {
	const { controllers } = await readConfig();

	if (!controllers || controllers.length === 0) {
		console.log('No controllers to set.');
		return;
	}

	const controller = {
		metadata: [],
		scope: { Write: null },
		expires_at: []
	};

	const actor = await getActor();
	await actor.set_controllers({
		controllers: controllers.map((controller) => Principal.fromText(controller)),
		controller
	});

	console.log('Controllers configuration applied 🎉');
};

try {
	await setControllers();
} catch (err) {
	console.error(err);
}
