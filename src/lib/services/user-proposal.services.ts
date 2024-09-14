import { loadUserProposals } from '$lib/services/loader-stores.services';
import { busy } from '$lib/stores/busy.store';
import { toasts } from '$lib/stores/toasts.store';
import type { OptionGovernanceId } from '$lib/types/governance';
import type { ProposalContent, ProposalMetadataDoc } from '$lib/types/juno';
import { isNullish } from '@dfinity/utils';
import { deleteManyDocs, getDoc } from '@junobuild/core-peer';

export const deleteProposal = async ({
	doc,
	governanceId
}: {
	governanceId: OptionGovernanceId;
	doc: ProposalMetadataDoc | undefined;
}): Promise<{ result: 'ok' | 'error'; err?: unknown }> => {
	if (isNullish(doc)) {
		toasts.error({
			msg: { text: 'No user proposal provided to be deleted.' }
		});

		return { result: 'error' };
	}

	if (doc.data.status !== 'draft') {
		toasts.error({
			msg: { text: 'Only draft of proposals can be deleted.' }
		});

		return { result: 'error' };
	}

	busy.start();

	try {
		const content = await getDoc<ProposalContent>({
			collection: 'content',
			key: doc.key
		});

		await deleteManyDocs({
			docs: [
				{
					collection: 'metadata',
					doc
				},
				...(isNullish(content)
					? []
					: [
							{
								collection: 'content',
								doc: content
							}
						])
			]
		});

		// Reload all proposals. Easy solution for now.
		await loadUserProposals({ startAfter: undefined, governanceId });

		toasts.success('Your proposal has been deleted.');

		return { result: 'ok' };
	} catch (err: unknown) {
		toasts.error({
			msg: { text: 'Something went wrong while sign-in.' },
			err
		});

		return { result: 'error', err };
	} finally {
		busy.stop();
	}
};
