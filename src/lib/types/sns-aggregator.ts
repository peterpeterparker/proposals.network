// Copy of NNS dapp sns-aggregator.ts and trimmed

type CanisterIds = {
	root_canister_id: string;
	governance_canister_id: string;
	ledger_canister_id: string;
	swap_canister_id: string;
	index_canister_id: string;
};

export type CachedSnsMetadataDto = {
	url: string | null;
	name: string | null;
	description: string | null;
	logo: string | null;
};

interface GenericNervousSystemFunctionDto {
	validator_canister_id: string | null;
	target_canister_id: string | null;
	validator_method_name: string | null;
	target_method_name: string | null;
}

export type CachedFunctionTypeDto =
	| { NativeNervousSystemFunction: Record<never, never> }
	| { GenericNervousSystemFunction: GenericNervousSystemFunctionDto };

export type CachedNervousFunctionDto = {
	id: number;
	name: string;
	description: string | null;
	function_type: CachedFunctionTypeDto | null;
};

export interface CachedDefaultFollowees {
	followees: bigint[];
}

export interface CachedNeuronPermissions {
	permissions: number[];
}

export interface ChachedVotingRewardsParameters {
	final_reward_rate_basis_points: number;
	initial_reward_rate_basis_points: number;
	reward_rate_transition_duration_seconds: number;
	round_duration_seconds: number;
}

export interface CachedNervousSystemParameters {
	default_followees: CachedDefaultFollowees;
	max_dissolve_delay_seconds: number;
	max_dissolve_delay_bonus_percentage: number;
	max_followees_per_function: number;
	neuron_claimer_permissions: CachedNeuronPermissions;
	neuron_minimum_stake_e8s: number;
	max_neuron_age_for_age_bonus: number;
	initial_voting_period_seconds: number;
	neuron_minimum_dissolve_delay_to_vote_seconds: number;
	reject_cost_e8s: number;
	max_proposals_to_keep_per_action: number;
	wait_for_quiet_deadline_increase_seconds: number;
	max_number_of_neurons: number;
	transaction_fee_e8s: number;
	max_number_of_proposals_with_ballots: number;
	max_age_bonus_percentage: number;
	neuron_grantable_permissions: CachedNeuronPermissions;
	voting_rewards_parameters: ChachedVotingRewardsParameters;
	maturity_modulation_disabled: boolean | null;
	max_number_of_principals_per_neuron: number;
}

export type CachedSnsTokenMetadataDtoNat = { Nat: number[] };
export type CachedSnsTokenMetadataDtoText = { Text: string };

// Export for testing purposes
export type CachedSnsTokenMetadataDto = (
	| (string | CachedSnsTokenMetadataDtoNat)[]
	| (string | CachedSnsTokenMetadataDtoText)[]
)[];

export type CachedSnsDto = {
	canister_ids: CanisterIds;
	meta: CachedSnsMetadataDto;
	parameters: {
		functions: CachedNervousFunctionDto[];
		reserved_ids: number[];
	};
	nervous_system_parameters: CachedNervousSystemParameters;
	icrc1_metadata: CachedSnsTokenMetadataDto;
};
