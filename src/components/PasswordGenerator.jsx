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
		generatePassword
	} = useGeneratePassword()

	const handleChangeCheckboxUpperCase = (e) => {
		setIncludeUppercase(e.target.checked)
	}

	const handleChangeCheckboxLowerCase = (e) => {
		setIncludeLowercase(e.target.checked)
	}

	const handleChangeCheckboxNumbers = (e) => {
		setIncludeNumbers(e.target.checked)
	}

	const handleChangeCheckboxSymbols = (e) => {
		setIncludeSymbols(e.target.checked)
	}

	return (
		<section className='grid grid-cols-1 gap-4 place-items-center'>
			<article className='w-80'>
				<PasswordResult password={password} placeholder='P4$5W0rD!' />
			</article>
			<article className='bg-slate-800 min-w-48 w-80 p-4 grid grid-cols-1 gap-4 text-xs'>
				<PasswordLength length={length} />
				<RangeSlider
					min='4'
					max='24'
					value={length}
					onChange={(e) => setLength(Number(e.target.value))}
					ariaLabel='Password length'
				/>
				<CheckboxLabeled
					label='Include Lowercase Letters'
					checked={includeLowercase}
					onChange={handleChangeCheckboxLowerCase}
				/>
				<CheckboxLabeled
					label='Include Uppercase Letters'
					checked={includeUppercase}
					onChange={handleChangeCheckboxUpperCase}
				/>
				<CheckboxLabeled
					label='Include Numbers'
					checked={includeNumbers}
					onChange={handleChangeCheckboxNumbers}
				/>
				<CheckboxLabeled
					label='Include Symbols'
					checked={includeSymbols}
					onChange={handleChangeCheckboxSymbols}
				/>
				<PasswordStrength password={password} />
				<Button onClick={generatePassword} text={'GENERATE 🡆'} ariaLabel='Generate password' />
			</article>
		</section>
	)
}
