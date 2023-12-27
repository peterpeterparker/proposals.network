import { E8S_PER_ICP } from '$lib/constants/app.constants';
import { type TokenAmountV2 } from '@dfinity/utils';
import type { Token } from '@dfinity/utils/dist/types/parser/token';

export const formatToken = (value: TokenAmountV2): string => {
	const decimals = value.token.decimals;
	const ulps = value.toUlps();
	const e8s = ulpsToE8s({ ulps, decimals });

	return formatTokenE8s({ value: e8s, token: value.token });
};

// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
type RoundMode =
	| 'ceil'
	| 'floor'
	| 'expand'
	| 'trunc'
	| 'halfCeil'
	| 'halfFloor'
	| 'halfExpand'
	| 'halfTrunc'
	| 'halfEven';

/**
 * Truncates the given amount to 8 decimals.
 *
 * This is used to then convert the amount to a string or to a number afterwards.
 */
const ulpsToE8s = ({ ulps, decimals }: { ulps: bigint; decimals: number }): bigint => {
	if (decimals === 8) {
		return ulps;
	} else if (decimals < 8) {
		return ulps * 10n ** BigInt(8 - decimals);
	}
	return ulps / 10n ** BigInt(decimals - 8);
};

/**
 * Jira L2-666:
 * - If ICP is zero then 0 should be displayed - i.e. without decimals
 * - ICP with round number (12.0) should be displayed 12.00
 * - ICP should be displayed with max. 2 decimals (12.1 → 12.10, 12.12353 → 12.12, 12.00003 → 12.00) in Accounts, but with up to 8 decimals without tailing 0s in transaction details.
 * - However, if ICP value is lower than 0.01 then it should be as it is without tailing 0s up to 8 decimals (e.g., 0.000003 is displayed as 0.000003)
 *
 * Jira GIX-1563:
 * - However, if requested, some amount might be displayed with a fix length of 8 decimals, regardless if leading zero or no leading zero
 */
export const formatTokenE8s = ({
	value,
	token: { decimals },
	roundingMode
}: {
	value: bigint;
	token: Token;
	roundingMode?: RoundMode;
}): string => {
	if (value === 0n) {
		return '0';
	}

	const converted = Number(value) / E8S_PER_ICP;

	return new Intl.NumberFormat('en-US', {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
		// "roundingMode" not present in `NumberFormatOptions`.
		// But it's supported by most modern browsers: https://caniuse.com/mdn-javascript_builtins_intl_numberformat_numberformat_options_roundingmode_parameter
		// eslint-disable-next-line
		// @ts-ignore
		roundingMode
	})
		.format(converted)
		.replace(/(\.0+|0+)$/, '');
};
