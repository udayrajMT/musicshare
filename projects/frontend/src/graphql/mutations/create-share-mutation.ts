import { IShare, shareKeys } from "../types";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import { IMutationOptions } from "../hook-types";
import { useCallback } from "react";
import { MutationUpdaterFn } from "apollo-client";
import { IGetSharesData, IGetSharesVariables, GET_SHARES } from "../queries/shares-query";

interface ICreateShareVariables {
	name: string;
}

interface ICreateShareData {
	createShare: IShare;
}

const CREATE_SHARE = gql`
	mutation CreateShare($name: String!) {
		createShare(name: $name) {
			${shareKeys}
		}
	}
`

export const useCreateShare = (opts?: IMutationOptions<ICreateShareData>) => {
	const updateSharesCache = useCallback<MutationUpdaterFn<ICreateShareData>>((cache, { data }) => {
		if (!data) return

		const currentData = cache.readQuery<IGetSharesData, IGetSharesVariables>({
			query: GET_SHARES,
		})!

		const { createShare: newShare } = data

		cache.writeQuery<IGetSharesData, IGetSharesVariables>({
			query: GET_SHARES,
			data: {
				viewer: {
					id: currentData.viewer.id,
					__typename: 'User',
					shares: currentData.viewer.shares.concat({
						...newShare,
						__typename: 'Share',
					})
				}
			}
		})
	}, [])

	const hook = useMutation<ICreateShareData, ICreateShareVariables>(CREATE_SHARE, {
		update: updateSharesCache,
		...(opts || {}),
	})

	return hook
}