import { IPlaylist } from "../types"
import gql from "graphql-tag"
import { useQuery } from "@apollo/client"

export interface IGetPlaylistsData {
	share: {
		id: string
		__typename: "Share"
		playlists: IPlaylist[]
	}
}

export interface IGetPlaylistsVariables {
	shareID: string | null
}

export const playlistKeys = `
	id
	name
	shareID
	dateAdded
`

export const GET_SHARE_PLAYLISTS = gql`
	query getSharePlaylists($shareID: String!){
		share(shareID: $shareID) {
			id,
			playlists{
				${playlistKeys}
			}
		}
	}
`

export const useSharePlaylists = (vars: IGetPlaylistsVariables) => {
	const { data, ...rest } = useQuery<IGetPlaylistsData, IGetPlaylistsVariables>(GET_SHARE_PLAYLISTS, {
		variables: vars,
		skip: !vars.shareID,
	})

	return {
		data: data ? data.share.playlists : null,
		...rest,
	}
}
