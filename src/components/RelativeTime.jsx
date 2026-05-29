const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const formatRelative = (timestamp) => {
	const diff = Date.now() - timestamp

	if (diff < MINUTE) return 'Just now'
	if (diff < HOUR) {
		const mins = Math.floor(diff / MINUTE)
		return `${mins} min ago`
	}
	if (diff < 2 * DAY) {
		if (diff < DAY) {
			const hours = Math.floor(diff / HOUR)
			return `${hours} hour${hours > 1 ? 's' : ''} ago`
		}
		return 'Yesterday'
	}
	const days = Math.floor(diff / DAY)
	return `${days} days ago`
}

const formatAbsolute = (timestamp) => {
	return new Date(timestamp).toLocaleString()
}

export default function RelativeTime({ timestamp, prefix = '' }) {
	return (
		<span title={formatAbsolute(timestamp)} className='cursor-help'>
			{prefix}{formatRelative(timestamp)}
		</span>
	)
}
