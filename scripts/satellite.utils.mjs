import { config } from 'dotenv';
import { initIdentity } from './identity.utils.mjs';

config();

export const satellite = {
	satelliteId: process.env.CANISTER_ID_SATELLITE,
	fetch,
	identity: initIdentity(),
	container: 'http://localhost:8080'
};
