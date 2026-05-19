import { PasswordEntropyCalculator } from '../services/PasswordEntropyCalculator'

const MAX_ENTROPY = 426
const STRENGTH_BARS = 10

export default function PasswordStrength({ password }) {
	const BACKGROUND_COLOR_CHECKED = 'bg-gray-300'
	const BACKGROUND_COLOR_UNCHECKED = 'bg-slate-900'

	const entropy = (PasswordEntropyCalculator(password) * STRENGTH_BARS) / MAX_ENTROPY

	const getBgEntropyElement = (index) => {
		return entropy > index ? BACKGROUND_COLOR_CHECKED : BACKGROUND_COLOR_UNCHECKED
	}

	return (
		<div className='w-full flex p-3 bg-slate-900'>
			<span className='text-gray-500'>STRENGTH</span>
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
