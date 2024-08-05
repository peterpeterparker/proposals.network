<script lang="ts">
	import InputText from '$lib/components/ui/InputText.svelte';
	import { setMetadata } from '$lib/services/idb.services';
	import { debounce, ICPToken, nonNullish, TokenAmountV2 } from '@dfinity/utils';
	import { SUBMIT_CONTEXT_KEY, type SubmitContext } from '$lib/types/submit.context';
	import { createEventDispatcher, getContext } from 'svelte';
	import Title from '$lib/components/ui/Title.svelte';
	import { assertSnsTreasuryFundsMetadata } from '$lib/services/submit.services';
	import SubmitContinue from '$lib/components/submit/SubmitContinue.svelte';
	import { formatToken, ulpsToE8s } from '$lib/utils/token.utils';
	import { onMount } from 'svelte';

	const { store, reload }: SubmitContext = getContext<SubmitContext>(SUBMIT_CONTEXT_KEY);

	let destinationAccount = '';
	let amount = '';

	const init = () => {
		destinationAccount = $store?.metadata?.destinationAccount ?? '';
		amount = nonNullish($store?.metadata?.amount)
			? formatToken(
					TokenAmountV2.fromUlps({
						amount: $store.metadata.amount,
						token: ICPToken
					})
				)
			: '';
	};

	onMount(init);

	const save = async () => {
		if (destinationAccount === '' && amount === '') {
			return;
		}

		const amountToBigint = (): bigint | undefined => {
			try {
				const token = TokenAmountV2.fromString({
					amount,
					token: ICPToken
				});

				if (token instanceof TokenAmountV2) {
					const value = ulpsToE8s({
						ulps: token.toUlps(),
						decimals: token.token.decimals
					});

					return value > 0n ? value : undefined;
				}
			} catch (err: unknown) {
				// We ignore error here
			}

			return undefined;
		};

		const parsedAmount = amountToBigint();

		if (
			destinationAccount === $store?.metadata?.destinationAccount &&
			parsedAmount === $store?.metadata?.amount
		) {
			return;
		}

		await setMetadata({
			...($store?.metadata ?? {}),
			...(destinationAccount !== '' && { destinationAccount }),
			...(nonNullish(parsedAmount) && { amount: parsedAmount })
		});

		await reload();
	};

	const debounceSave = debounce(save);

	$: destinationAccount,
		amount,
		(() => {
			if (destinationAccount === '' && amount === '') {
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
	placeholder="Destination account"
	bind:value={destinationAccount}
	pinPlaceholder={destinationAccount !== ''}
/>

<InputText placeholder="ICP amount" bind:value={amount} pinPlaceholder={amount !== ''} />

<SubmitContinue on:click={next} />
