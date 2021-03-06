import { IShareSong } from "@musicshare/shared-types"

export const buildSongName = (song: IShareSong): string => {
	let name = song.title

	// OnCall doesn't need these
	// if (song.remixer && song.remixer.length > 0) {
	// 	name += ` (${song.remixer.join(" & ")} ${song.suffix ? song.suffix : ""} ${song.type})`
	// }

	// if (song.featurings && song.featurings.length > 0) {
	// 	name += ` (feat. ${song.featurings.join(" & ")})`
	// }

	return name
}
