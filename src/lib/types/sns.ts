import { DEV } from '$lib/constants/app.constants';
import { Principal } from '@dfinity/principal';
import { isNullish } from '@dfinity/utils';
import { z } from 'zod';

const assertBytes = ({ text, min, max }: { text: string; min: number; max: number }): boolean => {
	const byteLength = new TextEncoder().encode(text).length;
	return byteLength >= min && byteLength <= max;
};

const assertValue = ({ value: text, labels }: { value: string; labels: string[] }): boolean => {
	if (text.trim().length !== text.length) {
		return false;
	}

	const [value, symbol] = text.split(' ');

	if (isNullish(value) || isNullish(symbol)) {
		return false;
	}

	const number = parseFloat(value.replace(/_/g, ''));
	const isNumber = !isNaN(number) && isFinite(number);

	return isNumber && labels.includes(symbol);
};

const urlSchema = z
	.string()
	.url()
	.refine((url: string): boolean => assertBytes({ text: url, min: 10, max: 512 }), {
		message: 'URL must be between 10 to 512 bytes'
	});

const titleSchema = z
	.string()
	.refine((text: string): boolean => assertBytes({ text, min: 4, max: 256 }), {
		message: 'Title must be between 4 to 256 bytes'
	});

const summarySchema = z
	.string()
	.refine((text: string): boolean => assertBytes({ text, min: 10, max: 2000 }), {
		message: 'Summary must be between 10 to 2000 bytes'
	});

const tokenNameSchema = z
	.string()
	.refine((text: string): boolean => assertBytes({ text, min: 4, max: 255 }), {
		message: 'Title must be between 4 to 255 bytes'
	});

const nnsProposalSchema = z.object({
	title: titleSchema,
	url: z.string().url(),
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

const e8sSchema = z.string().refine(
	(e8s: string): boolean =>
		assertValue({
			value: e8s,
			labels: ['e8s']
		}),
	{
		message: "Value must contain a number and end with 'e8s'"
	}
);

const tokenSchema = z.object({
	name: tokenNameSchema,
	symbol: symbolSchema,
	transaction_fee: e8sSchema,
	logo: z.string().optional()
});

const tokenValueSchema = z.string().refine(
	(token: string): boolean =>
		assertValue({
			value: token,
			labels: ['token', 'tokens']
		}),
	{
		message: "Value must contain a number and end with 'token' or 'tokens'"
	}
);

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
	rejection_fee: tokenValueSchema,
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
	minimum_creation_stake: tokenValueSchema
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
	stake: tokenValueSchema,
	memo: z.number(),
	dissolve_delay: durationSchema,
	vesting_period: durationSchema
});

export type NeuronSchema = z.infer<typeof neuronSchema>;

const distributionSchema = z.object({
	Neurons: neuronSchema.array(),
	InitialBalances: z.object({
		governance: tokenValueSchema,
		swap: tokenValueSchema
	}),
	total: tokenValueSchema
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
	minimum_direct_participation_icp: tokenValueSchema,
	maximum_direct_participation_icp: tokenValueSchema,
	minimum_participant_icp: tokenValueSchema,
	maximum_participant_icp: tokenValueSchema,
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

export const snsYaml = z.object({
	name: z.string().max(255),
	description: z.string().max(2000),
	Principals: z.string().array().length(0),
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
