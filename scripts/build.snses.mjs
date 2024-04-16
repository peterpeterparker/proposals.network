import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const AGGREGATOR_PAGE_SIZE = 10;
const SNS_AGGREGATOR_CANISTER_URL = 'https://3r4gx-wqaaa-aaaaq-aaaia-cai.icp0.io';
const AGGREGATOR_CANISTER_VERSION = 'v1';

const AGGREGATOR_URL = `${SNS_AGGREGATOR_CANISTER_URL}/${AGGREGATOR_CANISTER_VERSION}/sns`;

const DATA_FOLDER = join(process.cwd(), 'src', 'lib', 'data');
const STATIC_FOLDER = join(process.cwd(), 'static', 'logo', 'snses');

if (!existsSync(DATA_FOLDER)) {
	mkdirSync(DATA_FOLDER, { recursive: true });
}

if (!existsSync(STATIC_FOLDER)) {
	mkdirSync(STATIC_FOLDER, { recursive: true });
}

const aggregatorPageUrl = (page) => `list/page/${page}/slow.json`;

const querySnsAggregator = async (page = 0) => {
	const response = await fetch(`${AGGREGATOR_URL}/${aggregatorPageUrl(page)}`);

	if (!response.ok) {
		// If the error is after the first page, is because there are no more pages it fails
		if (page > 0) {
			return [];
		}

		throw new Error('Error loading SNS projects from aggregator canister');
	}

	const data = await response.json();

	if (data.length === AGGREGATOR_PAGE_SIZE) {
		const nextPageData = await querySnsAggregator(page + 1);
		return [...data, ...nextPageData];
	}

	return data;
};

const saveLogos = async (snses) => {
	const logos = snses.map(({ canister_ids: { root_canister_id, governance_canister_id } }) => ({
		logoUrl: `${AGGREGATOR_URL}/root/${root_canister_id}/logo.png`,
		rootCanisterId: root_canister_id,
		governanceCanisterId: governance_canister_id
	}));

	const downloadLogo = async ({ logoUrl, governanceCanisterId }) => {
		const response = await fetch(logoUrl);

		if (!response.ok) {
			throw new Error(`Error unable to download logo ${logoUrl}`);
		}

		const blob = await response.blob();

		writeFileSync(
			join(STATIC_FOLDER, `${governanceCanisterId}.png`),
			Buffer.from(await blob.arrayBuffer())
		);
	};

	await Promise.all(logos.map(downloadLogo));
};

export const findSnses = async () => {
	try {
		const data = await querySnsAggregator();

		// 3 === Committed
		const snses = data.filter(
			({
				swap_state: {
					swap: { lifecycle }
				}
			}) => lifecycle === 3
		);

		// We trim the logos as we are using only Sns projects logo which we are downloading as separate PNGs.
		// That was the JSON file also get smaller (Apr. 2024 - 135kb).
		const filterIcrc1Metadata = (icrc1_metadata) =>
			icrc1_metadata.filter(([key, value]) => key !== 'icrc1:logo');

		// All Snses results in a 1.6 JSON data (Apr. 2024). By selecting only the few metadata we actually required, we can spare bytes in the bundle (JSON down to 1.1. Mb).
		const filterSnsesData = snses.map(
			({ canister_ids, meta, icrc1_metadata, parameters, nervous_system_parameters }) => ({
				canister_ids,
				meta,
				icrc1_metadata: filterIcrc1Metadata(icrc1_metadata),
				nervous_system_parameters,
				parameters
			})
		);

		writeFileSync(join(DATA_FOLDER, 'snses.json'), JSON.stringify(filterSnsesData));

		await saveLogos(snses);
	} catch (err) {
		throw new Error('Error querying Snses', err);
	}
};

await findSnses();
