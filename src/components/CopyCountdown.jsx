export default function CopyCountdown({ remaining, total, warning }) {
	return (
		<div className='w-full py-2'>
			{warning && (
				<div className='text-xs text-red-400 text-center mb-1'>{warning}</div>
			)}
			{remaining > 0 && total > 0 && (
				<>
					<div className='text-xs text-gray-400 text-center'>
						Clipboard clears in {remaining}s
					</div>
					<div className='h-1 bg-slate-700 rounded-full overflow-hidden mt-1'>
						<div
							className='h-full bg-green-400 transition-all duration-1000 ease-linear'
							style={{ width: `${(remaining / total) * 100}%` }}
						/>
					</div>
				</>
			)}
		</div>
	)
}
