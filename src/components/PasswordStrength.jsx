const STRENGTH_BARS = 10

const STRENGTH_LEVELS = [
	{ maxBars: 2, label: 'Weak', color: 'bg-red-500', textColor: 'text-red-500' },
	{ maxBars: 4, label: 'Fair', color: 'bg-orange-500', textColor: 'text-orange-500' },
	{ maxBars: 7, label: 'Strong', color: 'bg-yellow-500', textColor: 'text-yellow-500' },
	{ maxBars: 10, label: 'Very Strong', color: 'bg-green-500', textColor: 'text-green-500' }
]

export default function PasswordStrength({ entropy = 0, maxEntropy = 426 }) {
	const BACKGROUND_COLOR_UNCHECKED = 'bg-slate-900'

	const scaledEntropy = (entropy * STRENGTH_BARS) / maxEntropy
	const filledBars = Math.min(Math.ceil(scaledEntropy), STRENGTH_BARS)

	const strengthLevel = entropy > 0
		? STRENGTH_LEVELS.find((level) => filledBars <= level.maxBars)
		: null

	const getBgEntropyElement = (index) => {
		if (!strengthLevel) return BACKGROUND_COLOR_UNCHECKED
		return scaledEntropy > index ? strengthLevel.color : BACKGROUND_COLOR_UNCHECKED
	}

	return (
		<div className='w-full flex items-center p-3 bg-slate-900'>
			<span className='text-gray-500'>STRENGTH</span>
			{strengthLevel && (
				<span className={`ml-2 text-xs font-bold ${strengthLevel.textColor}`}>
					{strengthLevel.label}
				</span>
			)}
			<span className='ml-auto text-gray-500 grid grid-cols-10 gap-2'>
				{[...Array(STRENGTH_BARS).keys()].map((value) => (
					<span
						key={value}
						className={`h-5 w-2 border-gray-300 border-2 inline ${getBgEntropyElement(value)}`}
					></span>
				))}
			</span>
		</div>
	)
}
