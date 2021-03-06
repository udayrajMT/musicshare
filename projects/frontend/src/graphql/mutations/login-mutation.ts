import gql from "graphql-tag"
import { useMutation, MutationHookOptions, MutationUpdaterFn, MutationResult, DataProxy } from "@apollo/client"
import { useCallback } from "react"
import {
	IAuthTokenData,
	GET_AUTH_TOKEN,
	IRefreshTokenData,
	GET_REFRESH_TOKEN,
} from "../client/queries/auth-token-query"

export interface ILoginVariables {
	password: string
	email: string
}

export interface ILoginData {
	login: {
		authToken: string
		refreshToken: string
	}
}

export const LOGIN = gql`
	mutation login($password: String!, $email: String!) {
		login(password: $password, email: $email) {
			authToken
			refreshToken
		}
	}
`

export const useLogin = (opts?: MutationHookOptions<ILoginData, ILoginVariables>) => {
	const [loginMutation, other] = useMutation<ILoginData, ILoginVariables>(LOGIN, opts)

	const updateCache = useCallback<MutationUpdaterFn<ILoginData>>((cache: DataProxy, { data }) => {
		cache.writeQuery<IAuthTokenData>({
			query: GET_AUTH_TOKEN,
			data: {
				authToken: data!.login.authToken,
			},
		})
		cache.writeQuery<IRefreshTokenData>({
			query: GET_REFRESH_TOKEN,
			data: {
				refreshToken: data!.login.refreshToken,
			},
		})
		localStorage.setItem("auth-token", data!.login.authToken)
		localStorage.setItem("refresh-token", data!.login.refreshToken)
	}, [])

	const login = useCallback(
		(email: string, password: string) => {
			loginMutation({
				variables: {
					email,
					password,
				},
				update: updateCache,
			})
		},
		[loginMutation, updateCache],
	)

	return [login, other] as [(email: string, password: string) => void, MutationResult<ILoginData>]
}
