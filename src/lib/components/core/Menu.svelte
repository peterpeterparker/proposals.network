<script lang="ts">
	import { slide, blur } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Backdrop from '$lib/components/ui/Backdrop.svelte';
	import IconClose from '$lib/components/icons/IconClose.svelte';
	import IconGitHub from '$lib/components/icons/IconGitHub.svelte';
	import IconLogo from '$lib/components/icons/IconLogo.svelte';
	import ButtonIcon from '$lib/components/ui/ButtonIcon.svelte';
	import IconLogout from '$lib/components/icons/IconLogout.svelte';
	import { userInitialized, userSignedIn } from '$lib/derived/user.derived';
	import { signIn, signOut } from '$lib/services/auth.services';
	import IconLogin from '$lib/components/icons/IconLogin.svelte';

	export let visible = false;
</script>

{#if visible}
	<div class="navbar-menu relative z-20 block">
		<Backdrop on:pnwrkClose={() => (visible = false)} />
		<nav
			in:blur={{ amount: 10, duration: 250 }}
			out:slide={{ easing: quintOut, axis: 'x', duration: 150 }}
			class="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm bg-white border-r overflow-y-auto border-r-2 border-black"
		>
			<div class="flex justify-center items-center h-20 p-5">
				<a
					class="inline-flex items-center gap-2 uppercase mr-auto font-bold leading-none"
					href="/"
					aria-label="Proposals.network home"><IconLogo /></a
				>
				<div>
					<button on:click={() => (visible = false)}><IconClose /></button>
				</div>
			</div>
			<div class="p-5">
				<ul class="flex flex-col">
					<div class="pb-8">
						<span class="text-lg font-bold block mb-4">Proposals.network</span>
						<div class="hover:underline hover:underline-offset-8 mb-4">
							<a href="/">Browse</a>
						</div>
						<div class="hover:underline hover:underline-offset-8 mb-4">
							<a href="/submit">Submit a new proposal</a>
						</div>
					</div>
					<div class="pb-12">
						<span class="text-lg font-bold block mb-4">Resources</span>
						<div class="hover:underline hover:underline-offset-8 mb-4">
							<a href="https://juno.build" rel="noreferrer nofollow noopener" target="_blank"
								>Juno</a
							>
						</div>
						<div class="hover:underline hover:underline-offset-8 mb-4">
							<a
								href="https://juno.build/docs/infrastructure/internet-computer"
								rel="noreferrer nofollow noopener"
								target="_blank">Internet Computer</a
							>
						</div>
						<div class="hover:underline hover:underline-offset-8 mb-4">
							<a
								href="https://wiki.internetcomputer.org/wiki/Network_Nervous_System"
								rel="noreferrer nofollow noopener"
								target="_blank">Network Nervous System</a
							>
						</div>
						<div class="hover:underline hover:underline-offset-8 mb-4">
							<a
								href="https://internetcomputer.org/docs/current/tokenomics/nns/nns-staking-voting-rewards"
								rel="noreferrer nofollow noopener"
								target="_blank">Staking and voting rewards</a
							>
						</div>
						<div class="hover:underline hover:underline-offset-8 mb-4">
							<a
								href="https://wiki.internetcomputer.org/wiki/Governance_of_the_Internet_Computer"
								rel="noreferrer nofollow noopener"
								target="_blank">Governance</a
							>
						</div>
					</div>
					<div class="pb-4">
						<div class="cursor-pointer flex gap-2 items-center">
							<a
								href="https://github.com/peterpeterparker/proposals.network"
								target="_blank"
								class="w-8 h-8 inline-flex items-center justify-center border-2 border-transparent rounded-full hover:bg-[#79F7FF] hover:border-black hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-[#00E1EF]"
								rel="noopener noreferrer"
								aria-label="Go to proposals-network source code on GitHub"><IconGitHub /></a
							>

							{#if $userInitialized}
								{#if $userSignedIn}
									<ButtonIcon disabled={false} on:click={signOut} ariaLabel="Sign-out">
										<IconLogout />
									</ButtonIcon>
								{:else}
									<ButtonIcon disabled={false} on:click={signIn} ariaLabel="Sign-in">
										<IconLogin />
									</ButtonIcon>
								{/if}
							{/if}
						</div>
					</div>
				</ul>
			</div>
		</nav>
	</div>
{/if}
