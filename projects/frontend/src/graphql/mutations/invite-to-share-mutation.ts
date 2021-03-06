import gql from "graphql-tag"
import { useMutation, MutationHookOptions } from "@apollo/client"

interface IInviteToShareData {
	inviteToShare: string | null
}

interface IInviteToShareVariables {
	input: {
		shareID: string
		email: string
	}
}

const INVITE_TO_SHARE = gql`
	mutation InviteToShare($input: InviteToShareInput!) {
		inviteToShare(input: $input)
	}
`

export const useInviteToShare = (opts?: MutationHookOptions<IInviteToShareData, IInviteToShareVariables>) => {
	const hook = useMutation<IInviteToShareData, IInviteToShareVariables>(INVITE_TO_SHARE, opts)

	return hook
}
