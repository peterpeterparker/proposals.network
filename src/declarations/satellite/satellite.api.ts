// This file was automatically generated by the Juno CLI.
// Any modifications may be overwritten.

import { getSatelliteExtendedActor } from '@junobuild/core-peer';
import type { _SERVICE as SatelliteActor } from './satellite.did';
import { idlFactory } from './satellite.factory.did.js';

export const buildVersion = async (): Promise<string> => {
	const { build_version } = await getSatelliteExtendedActor<SatelliteActor>({
		idlFactory
	});

	return await build_version();
};
