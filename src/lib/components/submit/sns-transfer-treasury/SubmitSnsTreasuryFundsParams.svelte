<script lang="ts">
	import InputText from '$lib/components/ui/InputText.svelte';
	import { setMetadata } from '$lib/services/idb.services';
	import { debounce, ICPToken, isNullish, nonNullish, TokenAmountV2 } from '@dfinity/utils';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import { createEventDispatcher, getContext } from 'svelte';
	import Title from '$lib/components/ui/Title.svelte';
	import { assertSnsTreasuryFundsMetadata } from '$lib/services/submit.services';
	import SubmitContinue from '$lib/components/submit/SubmitContinue.svelte';
	import { formatToken, ulpsToE8s } from '$lib/utils/token.utils';
	import { onMount } from 'svelte';
	import InputCurrency from '$lib/components/ui/InputCurrency.svelte';
	import { governanceStore } from '$lib/derived/governance.derived';
	import { page } from '$app/stores';

	const { store, reload }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);

	let destinationAddress = '';
	let amount: string | number | undefined;
	let url = '';

	const init = () => {
		// We get the potential query parameters imperatively to initialize the values only once
		const destinationAddressQueryParam = $page.url.searchParams.get('destination');
		const amountQueryParam = $page.url.searchParams.get('amount');

		destinationAddress = $store?.metadata?.destinationAddress ?? destinationAddressQueryParam ?? '';

		url =
			$store?.metadata?.url ??
			`https://proposals.network${nonNullish($governanceStore?.id) ? `?g=${$governanceStore.id}` : ''}`;

		amount = nonNullish($store?.metadata?.amount)
			? formatToken(
					TokenAmountV2.fromUlps({
						amount: $store.metadata.amount,
						token: ICPToken
					})
				).replaceAll(',', '')
			: undefined;

		if (nonNullish(amount) || isNullish(amountQueryParam)) {
			return;
		}

		const amountE8sToToken = (): TokenAmountV2 | undefined => {
			if (isNullish(amountQueryParam)) {
				return undefined;
			}

			try {
				return TokenAmountV2.fromUlps({
					amount: BigInt(amountQueryParam),
					token: ICPToken
				});
			} catch (err: unknown) {
				// We ignore error here
			}

			return undefined;
		};

		const amountQueryParamE8s = amountE8sToToken();

		amount = nonNullish(amountQueryParamE8s)
			? formatToken(amountQueryParamE8s).replaceAll(',', '')
			: undefined;
	};

	onMount(init);

	const save = async () => {
		if (destinationAddress === '' && (isNullish(amount) || amount === '') && url === '') {
			return;
		}

		const amountToToken = (): TokenAmountV2 | undefined => {
			if (isNullish(amount)) {
				return undefined;
			}

			try {
				const token = TokenAmountV2.fromString({
					amount: `${amount}`,
					token: ICPToken
				});

				if (token instanceof TokenAmountV2) {
					return token;
				}
			} catch (err: unknown) {
				// We ignore error here
			}

			return undefined;
		};

		const amountToken = amountToToken();

		if (
			destinationAddress === $store?.metadata?.destinationAddress &&
			amountToken === $store?.metadata?.amount &&
			url === $store?.metadata?.url
		) {
			return;
		}

		const title =
			destinationAddress !== '' && nonNullish(amountToken)
				? `Transfer ${formatToken(amountToken)} ICP to ${destinationAddress}`
				: destinationAddress !== ''
					? `Transfer treasury funds to ${destinationAddress}`
					: nonNullish(amountToken)
						? `Transfer ${formatToken(amountToken)} ICP`
						: 'Transfer treasury funds';

		const amountE8s = nonNullish(amountToken)
			? ulpsToE8s({
					ulps: amountToken.toUlps(),
					decimals: amountToken.token.decimals
				})
			: undefined;

		await setMetadata({
			...($store?.metadata ?? {}),
			...(destinationAddress !== $store?.metadata?.destinationAddress && { destinationAddress }),
			...(amountToken !== $store?.metadata?.amount && { amount: amountE8s }),
			...(url !== $store?.metadata?.url && { url }),
			title
		});

		await reload();
	};

	const debounceSave = debounce(save);

	$: destinationAddress,
		amount,
		(() => {
			if (destinationAddress === '' && (isNullish(amount) || amount === '') && url === '') {
				return;
			}

			debounceSave();
		})();

	const dispatch = createEventDispatcher();
	const next = async () => {
		const { valid } = await assertSnsTreasuryFundsMetadata($store?.metadata);

		if (!valid) {
			return;
		}

		dispatch('pnwrkNext');
	};
</script>

<Title>Propose A Transfer</Title>

<h2 class="mb-6 text-2xl">
	To transfer funds from an SNS treasury, you need to provide the destination account and the amount
	in ICP.
</h2>

<InputText
	placeholder="Destination address"
	bind:value={destinationAddress}
	pinPlaceholder={destinationAddress !== ''}
/>

<InputCurrency
	placeholder="Amount in ICP"
	bind:value={amount}
	pinPlaceholder={nonNullish(amount)}
/>

<InputText
	placeholder="A URL (for display purposes only)"
	bind:value={url}
	pinPlaceholder={url !== ''}
/>

<SubmitContinue on:click={next} />
