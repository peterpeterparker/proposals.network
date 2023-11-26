import { config } from 'dotenv';
import fetch from 'node-fetch';
import { initIdentity } from './identity.utils.mjs';

config();

export const satellite = {
	satelliteId: process.env.CANISTER_ID_satellite,
	fetch,
	identity: initIdentity(),
	env: 'dev'
};
