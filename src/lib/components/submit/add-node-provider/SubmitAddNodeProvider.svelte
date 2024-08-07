<script lang="ts">
	import InputText from '$lib/components/ui/InputText.svelte';
	import { setMetadata } from '$lib/services/idb.services';
	import { debounce } from '@dfinity/utils';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import { createEventDispatcher, getContext } from 'svelte';
	import Title from '$lib/components/ui/Title.svelte';
	import { assertAddNodeProviderMetadata } from '$lib/services/submit.services';
	import SubmitContinue from '$lib/components/submit/SubmitContinue.svelte';

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
			...(nodeProviderName !== '' && {
				nodeProviderName,
				title: `Add Node Provider: ${nodeProviderName}`
			}),
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

	const dispatch = createEventDispatcher();
	const next = async () => {
		const { valid } = await assertAddNodeProviderMetadata($store?.metadata);

		if (!valid) {
			return;
		}

		dispatch('pnwrkNext');
	};
</script>

<Title>Register Your Node Provider Principal</Title>

<h2 class="mb-6 text-2xl">
	To add a new node provider, provide the name, principal ID, announcement, URL, and SHA256 hash of
	your self-declaration and proof of identity documents.
</h2>

<InputText
	placeholder="Node Provider name"
	bind:value={nodeProviderName}
	pinPlaceholder={nodeProviderName !== ''}
/>

<InputText
	placeholder="A URL to your forum announcement and discussion (https://forum.dfinity.org...)"
	bind:value={url}
	pinPlaceholder={url !== ''}
/>

<InputText
	placeholder="A URL to your self-declaration document (https://wiki.internetcomputer.org/wiki/...)"
	bind:value={urlSelfDeclaration}
	pinPlaceholder={urlSelfDeclaration !== ''}
/>

<InputText
	placeholder="SHA256 hash of your self-declaration document"
	bind:value={hashSelfDeclaration}
	pinPlaceholder={hashSelfDeclaration !== ''}
/>

<InputText
	placeholder="A URL to your proof of identity document (https://wiki.internetcomputer.org/wiki/...)"
	bind:value={urlIdentityProof}
	pinPlaceholder={urlIdentityProof !== ''}
/>

<InputText
	placeholder="SHA256 hash of your proof of identity document"
	bind:value={hashIdentityProof}
	pinPlaceholder={hashIdentityProof !== ''}
/>

<InputText
	placeholder="Node Provider Principal ID"
	bind:value={nodeProviderId}
	pinPlaceholder={nodeProviderId !== ''}
/>

<SubmitContinue on:click={next} />
