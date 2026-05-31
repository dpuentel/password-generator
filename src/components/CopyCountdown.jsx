export default function CopyCountdown({ remaining, total }) {
	if (remaining <= 0 || total <= 0) return null

	const percentage = (remaining / total) * 100

	return (
		<div className='w-full py-2'>
			<div className='text-xs text-gray-400 text-center'>Clipboard clears in {remaining}s</div>
			<div className='h-1 bg-slate-700 rounded-full overflow-hidden mt-1'>
				<div
					className='h-full bg-green-400 transition-all duration-1000 ease-linear'
					style={{ width: `${percentage}%` }}
				/>
			</div>
		</div>
	)
}
