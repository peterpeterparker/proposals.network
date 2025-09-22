declare module 'svelte/elements' {
	export interface HTMLAttributes<T> {
		onjunoSignOutAuthTimer?: (event: CustomEvent<any>) => void;
		onpnwrkIntersecting?: (event: CustomEvent<any>) => void;
		onpnwrkOpenGovernance?: (event: CustomEvent<any>) => void;
		onpnwrkOpenUserProposalActions?: (event: CustomEvent<any>) => void;
	}
}

export {};
