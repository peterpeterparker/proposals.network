// Subset of NNS dapp sns-aggregator.ts and trimmed

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

export interface CachedNervousSystemParameters {
	neuron_minimum_dissolve_delay_to_vote_seconds: number;
	neuron_minimum_stake_e8s: number;
	reject_cost_e8s: number;
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
