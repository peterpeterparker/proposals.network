import { GOVERNANCE_CANISTER_ID } from '$lib/constants/app.constants';
import { toasts } from '$lib/stores/toasts.store';
import type { MakeProposalRequest, Motion } from '@dfinity/nns';
import { GovernanceCanister } from '@dfinity/nns';
import { Principal } from '@dfinity/principal';
import { createAgent, isNullish } from '@dfinity/utils';
import {unsafeIdentity, type User} from '@junobuild/core';

export type MotionProposalParams = Omit<MakeProposalRequest, 'action' | 'title'> & {
	title: string;
} & Motion;

export const submitMotionProposal = async ({
	user,
	...rest
}: { user: User } & MotionProposalParams): Promise<{
	result: 'ok' | 'error';
    proposalId: bigint | undefined
}> => {
	if (isNullish(GOVERNANCE_CANISTER_ID)) {
		toasts.error({
			msg: {
				text: 'The ICP governance canister ID is not set, therefore the proposal cannot be submitted.'
			}
		});
		return { result: 'error', proposalId: undefined };
	}

	try {
        const agent = await createAgent({
            host: 'http://localhost:8000',
            identity: await unsafeIdentity(),
            fetchRootKey: true
        });

        const { makeProposal } = GovernanceCanister.create({
            agent,
            canisterId: Principal.fromText(GOVERNANCE_CANISTER_ID)
        });

        const request = makeMotionProposalRequest({ ...rest });
        const proposalId = await makeProposal(request);

        return { result: 'ok', proposalId };
    } catch (err: unknown) {
		toasts.error({
			msg: { text: 'The proposal cannot be submitted to the ICP governance.' },
			err
		});
        return { result: 'error', proposalId: undefined };
    }
};

const makeMotionProposalRequest = ({
	motionText,
	...rest
}: MotionProposalParams): MakeProposalRequest => ({
	action: {
		Motion: {
			motionText
		}
	},
	...rest
});
