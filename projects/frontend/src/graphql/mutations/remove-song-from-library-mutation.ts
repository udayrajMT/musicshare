import gql from "graphql-tag"
import { useMutation, MutationResult, MutationHookOptions, MutationUpdaterFn } from "@apollo/client"
import { useCallback } from "react"
import { IGetShareWithSongsData, IGetShareWithSongsVariables, GET_SHARE_WITH_SONGS } from "../queries/share-songs-query"

interface IRemoveSongFromLibraryData {
	removeSongFromLibrary: boolean
}

interface IRemoveSongFromLibraryVariables {
	input: {
		shareID: string
		songID: string
	}
}

const REMOVE_SONG_FROM_LIBRARY = gql`
	mutation RemoveSongFromLibrary($input: RemoveSongFromLibraryInput!) {
		removeSongFromLibrary(input: $input)
	}
`

export const useRemoveSongFromLibrary = (
	opts?: MutationHookOptions<IRemoveSongFromLibraryData, IRemoveSongFromLibraryVariables>,
) => {
	const [removeSongFromLibraryMutation, other] = useMutation<
		IRemoveSongFromLibraryData,
		IRemoveSongFromLibraryVariables
	>(REMOVE_SONG_FROM_LIBRARY, opts)

	const makeUpdateCache = useCallback(
		(shareID: string, songID: string): MutationUpdaterFn<IRemoveSongFromLibraryData> => (cache, { data }) => {
			if (!data) return

			const shareData = cache.readQuery<IGetShareWithSongsData, IGetShareWithSongsVariables>({
				query: GET_SHARE_WITH_SONGS,
				variables: {
					shareID,
				},
			})

			if (!shareData) {
				return
			}

			const oldSong = shareData.share.songs.find((song) => song.id === songID)

			if (!oldSong) {
				console.error(`Cannot update cache because old song with id ${songID} is not present in cache`)

				return
			}

			// removes song from library as well as from the library's playlists
			cache.writeQuery<IGetShareWithSongsData, IGetShareWithSongsVariables>({
				query: GET_SHARE_WITH_SONGS,
				variables: {
					shareID,
				},
				data: {
					share: {
						...shareData.share,
						songs: shareData.share.songs.filter((song) => song.id !== songID),
					},
				},
			})
		},
		[],
	)

	const removeSongFromLibrary = useCallback(
		async (libraryID: string, songID: string) => {
			await removeSongFromLibraryMutation({
				variables: {
					input: {
						shareID: libraryID,
						songID,
					},
				},
				update: makeUpdateCache(libraryID, songID),
			})
		},
		[removeSongFromLibraryMutation, makeUpdateCache],
	)

	return [removeSongFromLibrary, other] as [
		(libraryID: string, songID: string) => Promise<void>,
		MutationResult<IRemoveSongFromLibraryData>,
	]
}
