import {
	type CachedSnsTokenMetadataDto,
	type CachedSnsTokenMetadataDtoNat,
	type CachedSnsTokenMetadataDtoText
} from '$lib/types/sns-aggregator';
import { IcrcMetadataResponseEntries } from '@dfinity/ledger-icrc';
import { isNullish, type Token } from '@dfinity/utils';

export const mapOptionalToken = (dto: CachedSnsTokenMetadataDto): Token | undefined => {
	const nullishToken: Partial<Token> = dto.reduce((acc, [key, value]) => {
		switch (key) {
			case IcrcMetadataResponseEntries.SYMBOL:
				acc = {
					...acc,
					...('Text' in (value as CachedSnsTokenMetadataDtoText) && {
						symbol: (value as CachedSnsTokenMetadataDtoText).Text
					})
				};
				break;
			case IcrcMetadataResponseEntries.NAME:
				acc = {
					...acc,
					...('Text' in (value as CachedSnsTokenMetadataDtoText) && {
						name: (value as CachedSnsTokenMetadataDtoText).Text
					})
				};
				break;
			case IcrcMetadataResponseEntries.FEE:
				acc = {
					...acc,
					...('Nat' in (value as CachedSnsTokenMetadataDtoNat) && {
						fee: (value as CachedSnsTokenMetadataDtoNat).Nat
					})
				};
				break;
			case IcrcMetadataResponseEntries.DECIMALS:
				acc = {
					...acc,
					...('Nat' in (value as CachedSnsTokenMetadataDtoNat) && {
						decimals: Number((value as CachedSnsTokenMetadataDtoNat).Nat)
					})
				};
				break;
			case IcrcMetadataResponseEntries.LOGO:
				acc = {
					...acc,
					...('Text' in (value as CachedSnsTokenMetadataDtoText) && {
						logo: (value as CachedSnsTokenMetadataDtoText).Text
					})
				};
		}

		return acc;
	}, {});

	if (
		isNullish(nullishToken.name) ||
		isNullish(nullishToken.symbol) ||
		isNullish(nullishToken.decimals)
	) {
		return undefined;
	}

	return nullishToken as Token;
};
