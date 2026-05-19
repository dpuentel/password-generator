import PasswordResult from './PasswordResult'
import PasswordLength from './PasswordLength'
import RangeSlider from './RangeSlider'
import CheckboxLabeled from './CheckboxLabeled'
import Button from './Button'
import PasswordStrength from './PasswordStrength'
import { useGeneratePassword } from '../hooks/useGeneratePassword'

export default function PasswordGenerator() {
	const {
		password,
		length,
		setLength,
		includeUppercase,
		setIncludeUppercase,
		includeLowercase,
		setIncludeLowercase,
		includeNumbers,
		setIncludeNumbers,
		includeSymbols,
		setIncludeSymbols,
		excludeAmbiguous,
		setExcludeAmbiguous,
		generatePassword
	} = useGeneratePassword()

	const activeCount = [includeLowercase, includeUppercase, includeNumbers, includeSymbols].filter(Boolean).length
	const isLastCharset = activeCount <= 1

	return (
		<section className='grid grid-cols-1 gap-4 place-items-center'>
			<article className='w-80'>
				<PasswordResult password={password} placeholder='P4$5W0rD!' />
			</article>
			<article className='bg-slate-800 min-w-48 w-80 p-4 grid grid-cols-1 gap-4 text-xs'>
				<PasswordLength length={length} />
				<RangeSlider
					min='4'
					max='64'
					value={length}
					onChange={(e) => setLength(Number(e.target.value))}
					ariaLabel='Password length'
				/>
				<CheckboxLabeled
					label='Include Lowercase Letters'
					checked={includeLowercase}
					onChange={(e) => setIncludeLowercase(e.target.checked)}
					disabled={includeLowercase && isLastCharset}
				/>
				<CheckboxLabeled
					label='Include Uppercase Letters'
					checked={includeUppercase}
					onChange={(e) => setIncludeUppercase(e.target.checked)}
					disabled={includeUppercase && isLastCharset}
				/>
				<CheckboxLabeled
					label='Include Numbers'
					checked={includeNumbers}
					onChange={(e) => setIncludeNumbers(e.target.checked)}
					disabled={includeNumbers && isLastCharset}
				/>
				<CheckboxLabeled
					label='Include Symbols'
					checked={includeSymbols}
					onChange={(e) => setIncludeSymbols(e.target.checked)}
					disabled={includeSymbols && isLastCharset}
				/>
				<CheckboxLabeled
					label='Exclude Ambiguous Characters (0OIl1|)'
					checked={excludeAmbiguous}
					onChange={(e) => setExcludeAmbiguous(e.target.checked)}
				/>
				<PasswordStrength password={password} />
				<Button onClick={generatePassword} text={'GENERATE 🡆'} ariaLabel='Generate password' />
			</article>
		</section>
	)
}
