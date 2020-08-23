// Note: one second of song is one day of onCall
// So display format shall change here
// Assumption: onCalls will always be < 60 days

// Trade Mark: Ofcourse this function is common in table & player!
export const formatDuration = (duration: number) => {
	if (isNaN(duration)) {
		return "Unknown Days"
	}
	const months = Math.floor(duration / 30)
	let remainder = duration - months * 30
	const days = remainder

	return [months ? `${months} Months, ` : ``, `${days} Days`].join(``)
}
