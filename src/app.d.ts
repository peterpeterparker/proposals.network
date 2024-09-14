// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	/* eslint-disable */

	declare namespace svelteHTML {
		interface HTMLAttributes<T> {
			'on:junoSignOutAuthTimer'?: (event: CustomEvent<any>) => void;
			'on:pnwrkIntersecting'?: (event: CustomEvent<any>) => void;
			'on:pnwrkOpenGovernance'?: (event: CustomEvent<any>) => void;
			'on:pnwrkOpenUserProposalActions'?: (event: CustomEvent<any>) => void;
		}
	}

	/* eslint-enable */
}

export {};
