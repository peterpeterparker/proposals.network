import { makeProposal } from '$lib/api/icp-proposal.api';
import { toasts } from '$lib/stores/toasts.store';
import type { MakeProposalRequest, Motion } from '@dfinity/nns';

export type MotionProposalParams = Omit<MakeProposalRequest, 'action' | 'title'> & {
	title: string;
} & Motion;

export const submitMotionProposal = async (
	params: MotionProposalParams
): Promise<{
	result: 'ok' | 'error';
	proposalId: bigint | undefined;
}> => {
	try {
		const proposalId = await makeProposal(params);

		return { result: 'ok', proposalId };
	} catch (err: unknown) {
		toasts.error({
			msg: { text: 'The proposal cannot be submitted to the ICP governance.' },
			err
		});
		return { result: 'error', proposalId: undefined };
	}
};
