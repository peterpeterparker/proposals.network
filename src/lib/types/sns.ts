import { DEV } from '$lib/constants/app.constants';
import { assertBytes } from '$lib/types/assertions';
import { Principal } from '@dfinity/principal';
import { convertStringToE8s, isNullish, nonNullish } from '@dfinity/utils';
import { z } from 'zod';

const assertE8sValue = (input: string): boolean => {
	const text = input.toLowerCase();

	if (!text.includes('e8s')) {
		return false;
	}

	if (text.trim().length !== text.length) {
		return false;
	}

	const noWhiteSpace = text.replace(/\s+/g, '');

	const pattern = /^([\d_.,]+)(e8s)$/i;
	const match = noWhiteSpace.match(pattern);

	if (isNullish(match)) {
		return false;
	}

	const [, value, symbol] = match;

	if (isNullish(value) || isNullish(symbol)) {
		return false;
	}

	const number = parseFloat(value.replace(/_/g, ''));

	return !isNaN(number) && isFinite(number);
};

const assertTokensValue = (input: string): boolean => {
	const text = input.toLowerCase();

	if (!text.includes('token') && !text.includes('tokens')) {
		return false;
	}

	if (text.trim().length !== text.length) {
		return false;
	}

	const noWhiteSpace = text.replace(/\s+/g, '');

	const pattern = /^([\d_.,]+)(token|tokens)$/i;
	const match = noWhiteSpace.match(pattern);

	if (isNullish(match)) {
		return false;
	}

	const [, value, symbol] = match;

	if (isNullish(value) || isNullish(symbol)) {
		return false;
	}

	const result = convertStringToE8s(value.replace(/_/g, ''));

	return typeof result === 'bigint';
};

const urlSchema = z
	.string()
	.url()
	.refine((url: string): boolean => assertBytes({ text: url, min: 10, max: 512 }), {
		message: 'URL must be between 10 to 512 bytes'
	});

const proposalUrlSchema = z
	.string()
	.url()
	.refine((url: string): boolean => assertBytes({ text: url, min: 10, max: 2048 }), {
		message: 'URL must be between 10 to 2048 bytes'
	})
	.refine(
		(url: string) => {
			try {
				new URL(url);
				return true;
			} catch {
				return false;
			}
		},
		{
			message: 'Invalid URL'
		}
	)
	.refine(
		(url: string): boolean => {
			const { protocol } = new URL(url);
			return protocol === 'https:';
		},
		{
			message: 'URL protocol must be HTTPS.'
		}
	)
	.refine(
		(url: string): boolean => {
			const { host } = new URL(url);
			return host === 'forum.dfinity.org';
		},
		{
			message: 'URL domain must be forum.dfinity.org.'
		}
	);

const titleSchema = z
	.string()
	.refine((text: string): boolean => assertBytes({ text, min: 4, max: 256 }), {
		message: 'Title must be between 4 to 256 bytes'
	});

const summarySchema = z
	.string()
	.optional()
	.refine(
		(text: string | undefined): boolean =>
			isNullish(text) || text === '' || assertBytes({ text, min: 10, max: 2000 }),
		{
			message: 'Summary must undefined, empty or between 10 to 2000 bytes'
		}
	);

const tokenNameSchema = z
	.string()
	.refine((text: string): boolean => text.trim().length === text.length, {
		message: 'Token must not have leading or trailing spaces'
	})
	.refine((text: string): boolean => assertBytes({ text, min: 4, max: 255 }), {
		message: 'Title must be between 4 to 255 bytes'
	});

const nnsProposalSchema = z.object({
	title: titleSchema,
	url: proposalUrlSchema,
	summary: summarySchema
});

const symbolSchema = z
	.string()
	.refine((symbol: string): boolean => symbol.trim().length === symbol.length, {
		message: 'Symbol must not have leading or trailing spaces'
	})
	.refine((text: string): boolean => assertBytes({ text, min: 3, max: 10 }), {
		message: 'Symbol must be between 3 to 10 bytes'
	});

const e8sOrTokensSchema = z
	.string()
	.refine((token: string): boolean => assertE8sValue(token) || assertTokensValue(token), {
		message: "Value must contain a number that ends with 'e8s' or 'token' or 'tokens'"
	});

const tokenSchema = z.object({
	name: tokenNameSchema,
	symbol: symbolSchema,
	transaction_fee: e8sOrTokensSchema,
	logo: z.string().optional()
});

const durationSchema = z.string().refine(
	(duration: string): boolean => {
		const durationSuffixes = [
			'seconds',
			'second',
			'sec',
			's',
			'minutes',
			'minute',
			'min',
			'm',
			'hours',
			'hour',
			'hr',
			'h',
			'days',
			'day',
			'd',
			'weeks',
			'week',
			'w',
			'months',
			'month',
			'M',
			'years',
			'year',
			'y'
		];
		const durationPattern = new RegExp(`^\\s*(\\d+\\s*(${durationSuffixes.join('|')})\\s*)+$`);
		return durationPattern.test(duration.trim());
	},
	{
		message: "Value must be a valid duration string (e.g., '1w 2d 3h')."
	}
);

const proposalsSchema = z.object({
	rejection_fee: e8sOrTokensSchema,
	initial_voting_period: durationSchema,
	maximum_wait_for_quiet_deadline_extension: durationSchema
});

const principalIdSchema = z.string().refine(
	(id: string) => {
		try {
			Principal.fromText(id);
			return true;
		} catch {
			return false;
		}
	},
	{
		message: 'Invalid PrincipalId'
	}
);

const neuronsSchema = z.object({
	minimum_creation_stake: e8sOrTokensSchema
});

const percentageSchema = z.string().refine(
	(percentage: string): boolean => {
		if (percentage.trim().length !== percentage.length) {
			return false;
		}

		return percentage.endsWith('%') && !isNaN(parseInt(percentage.slice(0, -1)));
	},
	{
		message: "Value must be a valid percentage string (e.g., '10%')."
	}
);

const votingSchema = z.object({
	minimum_dissolve_delay: durationSchema,
	MaximumVotingPowerBonuses: z.object({
		DissolveDelay: z.object({
			duration: durationSchema,
			bonus: percentageSchema
		}),
		Age: z.object({
			duration: durationSchema,
			bonus: percentageSchema
		})
	}),
	RewardRate: z.object({
		initial: percentageSchema,
		final: percentageSchema,
		transition_duration: durationSchema
	})
});

const neuronSchema = z.object({
	principal: principalIdSchema,
	stake: e8sOrTokensSchema,
	memo: z.number(),
	dissolve_delay: durationSchema,
	vesting_period: durationSchema
});

export type NeuronSchema = z.infer<typeof neuronSchema>;

const distributionSchema = z.object({
	Neurons: neuronSchema.array(),
	InitialBalances: z.object({
		treasury: e8sOrTokensSchema,
		swap: e8sOrTokensSchema
	}),
	total: e8sOrTokensSchema
});

const confirmationSchema = z
	.string()
	.refine(
		(text: string): boolean =>
			text.length >= 1 && text.length <= 1000 && assertBytes({ text, min: 0, max: 8000 }),
		{
			message: 'Confirmation must be between 1 to 1,000 characters and at most 8,000 bytes'
		}
	);

const countryCodeSchema = z
	.string()
	.length(2, 'Each country code must be exactly 2 characters long')
	.refine((code) => code === code.toUpperCase(), {
		message: 'Each country code must be in uppercase'
	});

const timeOfDaySchema = z
	.string()
	.refine((time: string): boolean => /^([01]\d|2[0-3]):([0-5]\d) UTC$/.test(time.trim()), {
		message: "Value must be a valid time of day string in the form 'hh:mm UTC'."
	});

const swapSchema = z.object({
	minimum_participants: z.number(),
	minimum_direct_participation_icp: e8sOrTokensSchema,
	maximum_direct_participation_icp: e8sOrTokensSchema,
	minimum_participant_icp: e8sOrTokensSchema,
	maximum_participant_icp: e8sOrTokensSchema,
	confirmation_text: confirmationSchema.optional(),
	restricted_countries: countryCodeSchema.array().optional(),
	VestingSchedule: z.object({
		events: z.number().min(2),
		interval: durationSchema
	}),
	start_time: DEV ? timeOfDaySchema.optional() : timeOfDaySchema,
	duration: durationSchema,
	neurons_fund_participation: z.boolean()
});

const descriptionSchema = z
	.string()
	.refine(
		(text: string | undefined): boolean =>
			nonNullish(text) && assertBytes({ text, min: 1, max: 2000 }),
		{
			message: 'Description must be given and up to 2000 bytes'
		}
	);

const nameSchema = z
	.string()
	.refine(
		(text: string | undefined): boolean =>
			nonNullish(text) && assertBytes({ text, min: 1, max: 255 }),
		{
			message: 'Name must be given and up to 255 bytes'
		}
	);

export const snsYaml = z.object({
	name: nameSchema,
	description: descriptionSchema,
	logo: z.string().optional(),
	url: urlSchema,
	NnsProposal: nnsProposalSchema,
	fallback_controller_principals: z.array(principalIdSchema).min(1),
	dapp_canisters: z.array(principalIdSchema),
	Token: tokenSchema,
	Proposals: proposalsSchema,
	Neurons: neuronsSchema,
	Voting: votingSchema,
	Distribution: distributionSchema,
	Swap: swapSchema
});

export type SnsYaml = z.infer<typeof snsYaml>;
