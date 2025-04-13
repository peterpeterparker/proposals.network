<script lang="ts">
	import Juno from '$lib/components/core/Juno.svelte';
	import Busy from '$lib/components/ui/Busy.svelte';
	import Toasts from '$lib/components/ui/Toasts.svelte';
	import Worker from '$lib/components/core/Worker.svelte';
	import { userStore } from '$lib/stores/user.store';
	import { browser } from '$app/environment';
	import { onNavigate } from '$app/navigation';
	import { layoutTitleStore } from '$lib/stores/layout.store';
	import GovernanceDialog from '$lib/components/governance/GovernanceDialog.svelte';

	import '$lib/styles/global.scss';
	import '../app.css';

	// To improve the UX while the app is loading on mainnet we display a spinner which is attached statically in the index.html files.
	// Once the authentication has been initialized we know most JavaScript resources has been loaded and therefore we can hide the spinner, the loading information.
	$: (() => {
		if (!browser) {
			return;
		}

		// We want to display a spinner until the authentication is loaded. This to avoid a glitch when either the landing page or effective content (sign-in / sign-out) is presented.
		if ($userStore === undefined) {
			return;
		}

		const spinner = document.querySelector('body > #app-spinner');
		spinner?.remove();
	})();

	// Source: https://svelte.dev/blog/view-transitions
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<title>{$layoutTitleStore}</title>
</svelte:head>

<Juno>
	<Worker>
		<slot />
	</Worker>
</Juno>

<Busy />
<Toasts />
<GovernanceDialog />
