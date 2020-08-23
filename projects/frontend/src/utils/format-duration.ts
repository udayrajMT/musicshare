export const formatDuration = (duration: number) => {
	// Note: one second of song is one day of onCall
	if (isNaN(duration)) {
		return "00:00"
	}

	const hours = Math.floor(duration / 3600)
	let remainder = duration - hours * 3600
	const minutes = Math.floor(remainder / 60)
	remainder = remainder - minutes * 60
	const seconds = remainder

	// Assumption: onCalls will always be < 60 days
	return `${fillZeros(seconds)} Days`
}

const fillZeros = (num: number) => (num < 10 ? `0${num}` : num)
