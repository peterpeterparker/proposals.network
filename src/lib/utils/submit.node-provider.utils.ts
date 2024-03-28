import { toasts } from '$lib/stores/toasts.store';
import type { ProposalEditableMetadata } from '$lib/types/juno';
import { assertNonNullish } from '@dfinity/utils';

export const assertUrlsFromWiki = ({
	urlIdentityProof,
	urlSelfDeclaration
}: Pick<ProposalEditableMetadata, 'urlSelfDeclaration' | 'urlIdentityProof'>): {
	valid: boolean;
	reason?: string;
	err?: unknown;
} => {
	const VALID_URL = 'wiki.internetcomputer.org';

	assertNonNullish(urlSelfDeclaration);
	assertNonNullish(urlIdentityProof);

	try {
		const { hostname: selfDeclarationHostname } = new URL(urlSelfDeclaration);
		const { hostname: identityProofHostname } = new URL(urlIdentityProof);

		if (selfDeclarationHostname !== VALID_URL) {
			return {
				valid: false,
				reason: `Expected URL for self-declaration to have hostname "${VALID_URL}", got "${selfDeclarationHostname}"`
			};
		}

		if (identityProofHostname !== VALID_URL) {
			return {
				valid: false,
				reason: `Expected URL for identity proof to have hostname "${VALID_URL}", got "${identityProofHostname}"`
			};
		}
	} catch (err) {
		toasts.error({ msg: { text: `Invalid URL` }, err });
		return {
			valid: false,
			reason: `Invalid URL`,
			err
		};
	}

	return { valid: true };
};

export const assertSHA256 = ({
	hashSelfDeclaration,
	hashIdentityProof
}: Pick<ProposalEditableMetadata, 'hashSelfDeclaration' | 'hashIdentityProof'>): {
	valid: boolean;
	reason?: string;
} => {
	assertNonNullish(hashSelfDeclaration);
	assertNonNullish(hashIdentityProof);

	const sha256Regex = /^[a-fA-F0-9]{64}$/;

	if (!sha256Regex.test(hashSelfDeclaration)) {
		return { valid: false, reason: `Hash for Self Declaration document should be of type SHA256.` };
	}

	if (!sha256Regex.test(hashIdentityProof)) {
		return {
			valid: false,
			reason: `Hash for Proof of Identity document should be of type SHA256.`
		};
	}

	return { valid: true };
};
