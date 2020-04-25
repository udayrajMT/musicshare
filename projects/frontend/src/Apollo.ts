import { ApolloClient } from "apollo-client"
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory"
import { HttpLink } from "apollo-link-http"
import { setContext } from "apollo-link-context"
import { onError } from "apollo-link-error"
import { ApolloLink, Observable } from "apollo-link"
import { resolvers } from "./graphql/client/resolvers"
import { makeConfigFromEnv } from "./config"
import { ISSUE_AUTH_TOKEN, IIssueAuthTokenData, IIssueAuthTokenVariables } from "./graphql/mutations/issue-auth-token"
import { getRefreshToken } from "./graphql/client/queries/auth-token-query"
import { promiseToObservable } from "./graphql/utils/promise-to-observable"
import { history } from "./components/routing/history"
import { logoutUser } from "./graphql/programmatic/logout"
import { isPlaylistSong } from "./graphql/types"

const config = makeConfigFromEnv()

const typeDefs = `
	type SongUpdateInput {
		title: String
		suffix: String
		year: Float
		bpm: Float
		releaseDate: String
		isRip: Boolean
		artists: [String!]
		remixer: [String!]
		featurings: [String!]
		type: String
		genres: [String!]
		label: String
		tags: [String!]
	}

	type InviteToShareInput {
		shareID: String!
		email: String!
	}

	type RevokeInvitationInput {
		shareID: String!
		userID: String!
	}

	type ShareIDInput {
		shareID: String!
	}

	type RemoveSongFromLibraryInput {
		shareID: String!
		songID: String!
	}
`

const httpLink = new HttpLink({
	uri: `${config.services.musicshare.backendURL}/graphql`,
})

interface IHTTPHeader {
	headers: {
		[key: string]: string
	}
}

const authMiddlewareLink = setContext(() => {
	const token = localStorage.getItem("auth-token")
	const headers: IHTTPHeader = {
		headers: {},
	}

	if (token) {
		headers.headers.authorization = token
	}

	return headers
})

const getNewAuthToken = (client: ApolloClient<NormalizedCacheObject>) => async () => {
	try {
		const refreshToken = await getRefreshToken(client)

		const response = await client.mutate<IIssueAuthTokenData, IIssueAuthTokenVariables>({
			mutation: ISSUE_AUTH_TOKEN,
			variables: {
				refreshToken,
			},
			context: {
				headers: {
					authorization: undefined,
				},
			},
		})

		return response.data ? response.data.issueAuthToken : null
	} catch (err) {
		console.error(err)

		return null
	}
}

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
	if (graphQLErrors) {
		for (const error of graphQLErrors) {
			if (error.message === "Access denied! You need to be authorized to perform this action!") {
				if (window.location.pathname !== "/login") {
					history.push("/login")
				}
			} else if (error.extensions && error.extensions.code === "UNAUTHENTICATED") {
				return promiseToObservable(getNewAuthToken(client)()).flatMap((authToken) => {
					cache.writeData({
						data: {
							authToken,
						},
					})
					if (authToken) {
						localStorage.setItem("auth-token", authToken)

						return forward(operation)
					} else {
						localStorage.removeItem("auth-token")

						history.push("/login")

						return Observable.of()
					}
				})
			} else if (error.message.startsWith("User with id") && error.message.endsWith("not found")) {
				logoutUser(client)

				history.push("/login")
			}
		}
	}

	if (networkError) {
		console.error(networkError)

		history.push("/offline")
	}
})

const cache = new InMemoryCache({
	dataIdFromObject: (obj: any) => {
		if (isPlaylistSong(obj)) {
			//playlists songs can occur multiple times with the same song.id, so we utilize the playlistSongID here
			return obj.playlistSongID
		} else {
			return obj.id
		}
	},
})
const client = new ApolloClient({
	link: ApolloLink.from([errorLink, authMiddlewareLink, httpLink]),
	cache,
	resolvers,
	typeDefs,
})

export { client, cache }
