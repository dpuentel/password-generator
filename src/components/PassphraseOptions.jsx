import PasswordLength from './PasswordLength'
import RangeSlider from './RangeSlider'
import { LANGUAGES } from '../services/dictionaries'

const SEPARATORS = [
	{ value: '-', label: 'Dash (-)' },
	{ value: '.', label: 'Dot (.)' },
	{ value: '_', label: 'Underscore (_)' },
	{ value: ' ', label: 'Space ( )' }
]

export default function PassphraseOptions({
	wordCount,
	setWordCount,
	separator,
	setSeparator,
	language,
	setLanguage
}) {
	return (
		<div className='grid grid-cols-1 gap-4'>
			<PasswordLength length={wordCount} label='Word Count' />
			<RangeSlider
				min='3'
				max='6'
				value={wordCount}
				onChange={(e) => setWordCount(Number(e.target.value))}
				ariaLabel='Word count'
			/>
			<div className='py-1'>
				<span className='block mb-2'>Separator</span>
				<div className='flex gap-2 flex-wrap'>
					{SEPARATORS.map((s) => (
						<button
							key={s.value}
							type='button'
							onClick={() => setSeparator(s.value)}
							className={`py-1 px-3 text-xs rounded ${
								separator === s.value
									? 'bg-slate-600 text-gray-200'
									: 'bg-slate-900 text-gray-500 hover:text-gray-400'
							}`}
							aria-label={s.label}
						>
							{s.label}
						</button>
					))}
				</div>
			</div>
			<div className='py-1'>
				<label htmlFor='language' className='block mb-2'>
					Language
				</label>
				<select
					id='language'
					value={language}
					onChange={(e) => setLanguage(e.target.value)}
					className='w-full bg-slate-900 text-gray-300 p-2 rounded text-xs'
					aria-label='Dictionary language'
				>
					{LANGUAGES.map((lang) => (
						<option key={lang.code} value={lang.code}>
							{lang.label}
						</option>
					))}
				</select>
			</div>
		</div>
	)
}
