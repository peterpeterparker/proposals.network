<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import { setMetadata } from '$lib/services/idb.services';
	import { debounce } from '@dfinity/utils';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import { getContext } from 'svelte';

	const { store, reload }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);

	let nodeProviderName = '';
	let url = '';
	let urlSelfDeclaration = '';
	let urlIdentityProof = '';
	let hashSelfDeclaration = '';
	let hashIdentityProof = '';
	let nodeProviderId = '';

	const init = () => {
		nodeProviderName = $store?.metadata?.nodeProviderName ?? '';
		url = $store?.metadata?.url ?? '';
		urlSelfDeclaration = $store?.metadata?.urlSelfDeclaration ?? '';
		urlIdentityProof = $store?.metadata?.urlIdentityProof ?? '';
		hashSelfDeclaration = $store?.metadata?.hashSelfDeclaration ?? '';
		hashIdentityProof = $store?.metadata?.hashIdentityProof ?? '';
		nodeProviderId = $store?.metadata?.nodeProviderId ?? '';
	};

	$: $store, init();

	const save = async () => {
		if (
			nodeProviderId === '' &&
			nodeProviderName === '' &&
			url === '' &&
			urlSelfDeclaration === '' &&
			urlIdentityProof === '' &&
			hashSelfDeclaration === '' &&
			hashIdentityProof === ''
		) {
			return;
		}

		if (
			nodeProviderId === $store?.metadata?.nodeProviderId &&
			nodeProviderName === $store?.metadata?.nodeProviderName &&
			url === $store?.metadata?.url &&
			urlSelfDeclaration === $store?.metadata?.urlSelfDeclaration &&
			urlIdentityProof === $store?.metadata?.urlIdentityProof &&
			hashSelfDeclaration === $store?.metadata?.hashSelfDeclaration &&
			hashIdentityProof === $store?.metadata?.hashIdentityProof
		) {
			return;
		}

		await setMetadata({
			...($store?.metadata ?? {}),
			...(nodeProviderName !== '' && { nodeProviderName }),
			...(url !== '' && { url }),
			...(urlSelfDeclaration !== '' && { urlSelfDeclaration }),
			...(urlIdentityProof !== '' && { urlIdentityProof }),
			...(hashSelfDeclaration !== '' && { hashSelfDeclaration }),
			...(hashIdentityProof !== '' && { hashIdentityProof }),
			...(nodeProviderId !== '' && { nodeProviderId })
		});

		await reload();
	};

	const debounceSave = debounce(save);

	$: nodeProviderId,
		nodeProviderName,
		url,
		urlSelfDeclaration,
		urlIdentityProof,
		hashSelfDeclaration,
		hashIdentityProof,
		(() => {
			if (
				nodeProviderId === '' &&
				nodeProviderName === '' &&
				url === '' &&
				urlSelfDeclaration === '' &&
				urlIdentityProof === '' &&
				hashSelfDeclaration === '' &&
				hashIdentityProof === ''
			) {
				return;
			}

			debounceSave();
		})();

	export function checkFields(): boolean {
		const validUrlDomain = 'https://wiki.internetcomputer.org/';
		const fields = [
			nodeProviderName,
			url,
			urlSelfDeclaration,
			hashSelfDeclaration,
			urlIdentityProof,
			hashIdentityProof,
			nodeProviderId
		];

		if (fields.some((field) => field === '')) {
			console.log('fill in all fields');
			return false;
		}

		if (!urlSelfDeclaration.startsWith(validUrlDomain) || !urlIdentityProof.startsWith(validUrlDomain) ) {
			console.log('Invalid URL for self-declaration');
			return false;
		}

		return true;
	}
</script>

<h1 class="mb-12 text-4xl font-bold capitalize md:text-6xl">
	Register Your Node Provider Principal
</h1>

<h2 class="mb-6 text-2xl">
	To add a new node provider, provide the name, principal ID, announcement, URL, and SHA256 hash of
	your self-declaration and proof of identity documents.
</h2>

<Input
	placeholder="Node Provider name"
	bind:value={nodeProviderName}
	pinPlaceholder={nodeProviderName !== ''}
/>

<Input
	placeholder="A URL to your forum announcement and discussion (https://forum.dfinity.org...)"
	bind:value={url}
	pinPlaceholder={url !== ''}
/>

<Input
	placeholder="A URL to your self-declaration document (https://wiki.internetcomputer.org/wiki/...)"
	bind:value={urlSelfDeclaration}
	pinPlaceholder={urlSelfDeclaration !== ''}
/>

<Input
	placeholder="SHA256 hash of your self-declaration document"
	bind:value={hashSelfDeclaration}
	pinPlaceholder={hashSelfDeclaration !== ''}
/>

<Input
	placeholder="A URL to your proof of identity document (https://wiki.internetcomputer.org/wiki/...)"
	bind:value={urlIdentityProof}
	pinPlaceholder={urlIdentityProof !== ''}
/>

<Input
	placeholder="SHA256 hash of your proof of identity document"
	bind:value={hashIdentityProof}
	pinPlaceholder={hashIdentityProof !== ''}
/>

<Input
	placeholder="Node Provider Principal ID"
	bind:value={nodeProviderId}
	pinPlaceholder={nodeProviderId !== ''}
/>
